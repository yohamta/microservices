import { Publisher, OrderCancelledEvent, Subjects } from "@yotahamada/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
