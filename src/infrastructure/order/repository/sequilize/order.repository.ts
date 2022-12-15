import { or } from "sequelize";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  } 
  
  async find(id: string): Promise<Order> {
    let orderModel;
    try{
        orderModel = await OrderModel.findOne({
        where: { id },
        include: ["items"],  
        rejectOnEmpty: true,
      });
    }catch (error) {
      throw new Error("Order not found");
    }

    return new Order(orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(orderItemModel => new OrderItem(
          orderItemModel.id,
          orderItemModel.name,
          orderItemModel.price,
          orderItemModel.product_id,
          orderItemModel.quantity)));
  }

  async findAll() :Promise<Order[]>{
    const orderModels = await OrderModel.findAll({include: ["items"]});  
    
    const orders = orderModels.map((orderModels) => {

      let order = new Order(orderModels.id,
        orderModels.customer_id,
        orderModels.items.map(orderItemModel => new OrderItem(
            orderItemModel.id,
            orderItemModel.name,
            orderItemModel.price,
            orderItemModel.product_id,
            orderItemModel.quantity)));

      return order;
    });
    
    return orders;  
  }

}
