import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['CONNECTION_STRING'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

import express from 'express';
import dbConnect from './Config/dbConfig.js'
const app = express();
const port = process.env.PORT || 5000 ;
import connectRabbitMQ, { getChannel } from './utils/connectRabbit.js';
import Order from './Models/orderModel.js';
app.use(express.json());
import router from './Routes/orderRoutes.js';

app.use('/order', router);
const startServer = async () => {
    try {
        await dbConnect();
        await connectRabbitMQ();
        const channel = getChannel();

        function createOrder(products, userEmail){
            if (!products || products.length === 0) {
                throw new Error("Products array cannot be empty");
            }
            let total = 0;
            for(let t=0; t<products.length; t++){
                total += products[t].price;
            }
            const newOrder = new Order({
                products,
                user: userEmail,
                totalPrice: total
            });
            return newOrder;
        }

        channel.consume("ORDER", async (data) => {
            try {
                const {products, userEmail} = JSON.parse(data.content);
                const newOrder = await createOrder(products, userEmail).save();
                console.log("Order received:", products, userEmail);
                channel.ack(data);

                channel.sendToQueue(
                    "PRODUCT",
                    Buffer.from(JSON.stringify({ newOrder }))
                );
            } catch (error) {
                console.error("Error processing order:", error);
                channel.nack(data, false, true);
            }
        });

        app.listen(port, () => {
            console.log(`Order-Api is running on ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();