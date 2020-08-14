import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@yotahamada/common";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queues";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting this many milliseconds to process the job:", delay);

    try {
      expirationQueue.add(
        {
          orderId: data.id,
        },
        {
          delay,
        }
      );
    } catch (error) {
      throw error;
    }

    msg.ack();
  }
}
