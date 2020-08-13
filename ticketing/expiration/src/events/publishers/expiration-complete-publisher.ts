import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@yotahamada/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
