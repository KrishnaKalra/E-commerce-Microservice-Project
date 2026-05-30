import express from 'express'
import {getOrder,findOrders,createOrder,updateOrder} from '../controller/order.controller.js'

const router=express.Router();
router.get('/',findOrders);
router.get('/:id',getOrder);
router.post('/',createOrder);
router.patch('/:id',updateOrder);
 
export default router;