import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import { OrderStatus, OrderCancelledEvent } from "@yotahamada/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listeners";
import { Order } from "../../../models/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save a ticket
  const orderId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    version: 0,
    userId: "123",
    status: OrderStatus.Created,
    price: 10,
  });
  await order.save();

  // create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "123",
    },
  };

  // create a fake message obect
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("updates the ticket and acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const order = await Order.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
