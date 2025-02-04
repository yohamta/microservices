import { Publisher, TicketCreatedEvent, Subjects } from "@yotahamada/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
