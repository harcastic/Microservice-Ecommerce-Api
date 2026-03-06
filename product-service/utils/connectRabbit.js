import amqp from "amqplib";

let channel;

async function connectRabbitMQ() {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();

    await channel.assertQueue("ORDER");
    await channel.assertQueue("PRODUCT");

    console.log("RabbitMQ connected");
};
export default connectRabbitMQ;

export const getChannel = () => {
    return channel;
};