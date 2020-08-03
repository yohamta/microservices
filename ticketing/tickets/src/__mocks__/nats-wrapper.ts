export const natsWrapper = {
  client: {
    publish(subject: string, data: string, callback: () => void) {
      console.log("Fake Nats Wrapper: publish is called", {
        subject,
        data,
      });
      callback();
    },
  },
};
