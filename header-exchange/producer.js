// // ======================================= With Header Exchange
const amqp = require("amqplib");

const sendNotification = async (headers, message) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "header_exchange";
    const exchangeType = "headers";

    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, "", Buffer.from(message), {
      persistent: true,
      headers,
    });
    console.log("Send Notification with headers");

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log("Error", error);
  }
};
sendNotification(
  {
    "x-match": "all",
    "notification-type": "new_video",
    "content-type": "video",
  },
  "new music video uploaded"
);
sendNotification(
  {
    "x-match": "all",
    "notification-type": "live_stream",
    "content-type": "gaming",
  },
  "Gaming live stream started"
);
sendNotification(
  {
    "x-match": "any",
    "notification-type-comment": "comment",
    "content-type": "vlog",
  },
  "New comment on your vlog"
);
sendNotification(
  {
    "x-match": "any",
    "notification-type-like": "like",
    "content-type": "vlog",
  },
  "New like on your vlog"
);
