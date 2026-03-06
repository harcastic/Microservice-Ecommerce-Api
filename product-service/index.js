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
const app = express();
const port = process.env.PORT || 5000;
import dbConnect from './config/dbConfig.js';
import connectRabbitMQ from './utils/connectRabbit.js';
import productRoute from './Routes/productRoutes.js';
import { getChannel } from './utils/connectRabbit.js';
app.use(express.json());


// Routes
app.use('/product', productRoute);

const startServer = async () => {
    try {
        await dbConnect();
        await connectRabbitMQ();
        const channel = getChannel();

        // Set up persistent consumer for PRODUCT queue
        channel.consume("PRODUCT", (data) => {
            try {
                const orderData = JSON.parse(data.content);
                console.log("Order completed:", orderData);
                channel.ack(data);
            } catch (error) {
                console.error("Error processing PRODUCT queue message:", error);
                channel.nack(data, false, true);
            }
        });

        app.listen(port, () => {
            console.log(`Product-Api is running on ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
