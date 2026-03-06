import express from 'express';
const router = express.Router();
import createProduct,{ buyProduct }  from '../Controllers/productController.js';
import verifyToken from '../../middleware/IsAuthenticated.js'

router.post('/create', verifyToken, createProduct);
router.post('/buy', verifyToken, buyProduct);

export default router;