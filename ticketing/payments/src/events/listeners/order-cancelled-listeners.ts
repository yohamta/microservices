import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  OrderStatus,
} from "@yotahamada/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    // If no ticket, throw error
    if (!order) {
      throw new Error("Order not found");
    }

    // Mark the ticket as being reserved by setting its orderId property
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // ack the message
    msg.ack();
  }
}
