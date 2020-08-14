import { Publisher, Subjects, PaymentCreatedEvent } from "@yotahamada/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
