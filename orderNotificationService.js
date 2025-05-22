const amqp = require("amqplib");

const receivemessages = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const queue = "order_queue";

    await channel.assertExchange(exchange, "topic", { durable: false });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "order.*");

    console.log("Waiting for messages");
    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          console.log(
            `[Order Notification] Msg was consumed! with ${
              msg.fields.routingKey
            } and contect is ${msg.content.toString()}`
          );
          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.log("Error", error);
  }
};

receivemessages();
