import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderStatus, ExpirationCompleteEvent } from "@yotahamada/common";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // Create and save a order
  const order = Order.build({
    userId: "123",
    expireAt: new Date(),
    status: OrderStatus.Created,
    ticket,
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // create a fake message obect
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.orderId);
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled event", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(data.orderId);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
