import express from 'express';
import verifyToken from '../../middleware/IsAuthenticated.js';
const router = express.Router();
// import getOrders from '../Controllers/orderController.js';

// router.get('/orders', verifyToken, getOrders);

export default router;
