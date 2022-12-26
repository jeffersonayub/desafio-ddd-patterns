import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ChangeAddressEvent from "../change-address.event";

export default class EnviaConsoleLogHandler
implements EventHandlerInterface<ChangeAddressEvent>
{
    handle(event:ChangeAddressEvent): void{
        console.log('Endereço do cliente: %s %s, alterado para: %s',
        event.eventData.id,
        event.eventData.nome,
        event.eventData.endereco,
    )}
}