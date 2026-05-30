import express from 'express'
import { createOrder, findOrders, getOrder, updateOrder } from '../contoller/order.controller.js';
const orderRouter=express.Router();
orderRouter.get('/',findOrders);
orderRouter.get('/:id',getOrder);
orderRouter.post('/',createOrder);
orderRouter.patch('/:id',updateOrder);

export default orderRouter;