import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@yotahamada/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = OrderStatus.Complete;
    await order.save();

    msg.ack();
  }
}
