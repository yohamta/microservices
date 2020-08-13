import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@yotahamada/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    msg.ack();
  }
}
