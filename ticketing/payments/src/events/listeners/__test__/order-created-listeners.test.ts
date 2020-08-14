import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import { OrderCreatedEvent, OrderStatus } from "@yotahamada/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listeners";
import { Order } from "../../../models/order";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "sdfasfe",
    expiresAt: "sdfsdaf",
    ticket: {
      id: '1234j12lk23j',
      price: 10,
    },
  };

  // create a fake message obect
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.id).toEqual(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
