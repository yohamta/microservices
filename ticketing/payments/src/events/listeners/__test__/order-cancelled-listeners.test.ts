import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import {
  OrderCreatedEvent,
  OrderStatus,
  OrderCancelledEvent,
} from "@yotahamada/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listeners";

const setup = async () => {
  // // create an instance of the listener
  // const listener = new OrderCancelledListener(natsWrapper.client);

  // // Create and save a ticket
  // const orderId = mongoose.Types.ObjectId().toHexString();
  // const ticket = Ticket.build({
  //   title: "concert",
  //   price: 99,
  //   userId: "dsafsd",
  //   orderId,
  // });
  // await ticket.save();

  // // create a fake data event
  // const data: OrderCancelledEvent["data"] = {
  //   id: new mongoose.Types.ObjectId().toHexString(),
  //   version: 0,
  //   ticket: {
  //     id: ticket.id,
  //   },
  // };

  // // create a fake message obect
  // // @ts-ignore
  // const msg: Message = {
  //   ack: jest.fn(),
  // };

  // return { listener, data, msg };
};

it("updates the ticket, publishes an event and acks the message", async () => {
  // const { listener, data, msg } = await setup();

  // // call the onMessage function with the data object + message object
  // await listener.onMessage(data, msg);

  // // write assertions to make sure a ticket was created
  // const ticket = await Ticket.findById(data.ticket.id);
  // expect(ticket!.orderId).not.toBeDefined();

  // // write assertions to make sure ack function is called
  // expect(msg.ack).toHaveBeenCalled();

  // // publishes an event
  // expect(natsWrapper.client.publish).toHaveBeenCalled();

  // const ticketUpdatedData = JSON.parse(
  //   (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  // );
  // expect(ticketUpdatedData.orderId).not.toBeDefined();
});
