import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import {
  TicketCreatedEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@yotahamada/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedListener } from "../order-created-listeners";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "dsafsd",
  });
  await ticket.save();

  // create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "sdfasfe",
    expiresAt: "sdfsdaf",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create a fake message obect
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("sets the orderId of the ticket", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.ticket.id);
  expect(ticket).toBeDefined();
  expect(ticket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
