import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).toEqual(401);
});

it("returns status other than 401 if the user is signed in", async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if ticketId is not provided", async () => {
  const cookie = await global.signup();
  await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({})
    .expect(400);
});

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: "sdfasdfa",
    status: OrderStatus.Created,
    expireAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
