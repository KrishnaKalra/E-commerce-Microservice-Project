import express from 'express';
import authRouter from './auth.route.js';
import inventoryRouter from './inventory.route.js';
import productRouter from './product.route.js';
import orderRouter from './order.route.js';
import authMiddleware from '../authMiddleware/auth-middleware.js';
const router=express.Router();
router.use(authRouter);
router.use(authMiddleware);
router.use('/inventory',inventoryRouter);
router.use('/order',orderRouter);
router.use('/product',productRouter)
export default router;