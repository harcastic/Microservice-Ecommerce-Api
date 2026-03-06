import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['CONNECTION_STRING', 'SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

import express from 'express';
const app = express();
const port = process.env.PORT || 5000;
import authRoute from './Routes/authRoute.js'
import dbConnect from './Config/dbConfig.js';
dbConnect();

app.use(express.json());

// AUTH 
app.use('/api/auth', authRoute);

app.listen(port, () => {
    console.log(`Auth-Api is running on ${port}`);
})