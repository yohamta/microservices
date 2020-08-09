import { Publisher, OrderCreatedEvent, Subjects } from "@yotahamada/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
