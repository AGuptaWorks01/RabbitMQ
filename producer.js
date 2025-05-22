const amqp = require("amqplib");

const sendMessage = async (routingKey, message) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const exchangeType = "topic";

    await channel.assertExchange(exchange, exchangeType, { durable: false });

    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    console.log(` [x] Sent '${routingKey}' : ${JSON.stringify(message)}`);
    console.log(
      `msg was sent! with routing key as ${routingKey} and content ${JSON.stringify(
        message
      )}`
    );

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log("Error", error);
  }
};
sendMessage("order.placed", { order: 123, sendMessage: "placed" });
sendMessage("payment.processed", { paymentId: 99, sendMessage: "processed" });
