import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@yotahamada/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    try {
      const charge = await stripe.charges.create({
        amount: order.price,
        currency: "jpy",
        source: token,
      });

      const payment = Payment.build({
        orderId: order.id,
        stripeId: charge.id,
      });
      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: order.id,
        stripeId: charge.id,
      });
    } catch (err) {
      throw err;
    }

    res.status(201).send();
  }
);

export { router as CreateChargeRouter };
