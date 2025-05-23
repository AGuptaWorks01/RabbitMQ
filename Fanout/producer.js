// ======================================= With Fanout
const amqp = require("amqplib");

const announceNewProduct = async (product) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "new_product_launch";
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const message = JSON.stringify(product);

    channel.publish(exchange, "", Buffer.from(message), { persistent: true });
    console.log(" Sent => ", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log("Error", error);
  }
};
announceNewProduct({ id: 123, name: "iphone 19 Max pro", price: 200000 });
