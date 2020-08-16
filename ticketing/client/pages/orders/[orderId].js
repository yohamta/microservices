import useRequest from "../../hooks/use-request";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expireAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      {timeLeft} seconds until order expires
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id });
        }}
        stripeKey="pk_test_51HFu7mDvpG0FwhPfyVvfB59WMuD3zSBmRdWYzGVbWymLk1mbqas4mOJco0SZrtT5PIIJ9F0GhsTmbEqFh9bfbAtO00M8IZwNzb"
        amount={order.ticket.price}
        currency="jpy"
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
