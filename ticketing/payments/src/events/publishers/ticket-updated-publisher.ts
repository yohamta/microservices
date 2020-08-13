import { Publisher, TicketUpdatedEvent, Subjects } from "@yotahamada/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
