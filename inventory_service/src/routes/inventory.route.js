import express from 'express';
import { createProductInventory, createReservation, getProductInventory, updateProductInventory, updateReservationStatus } from '../contoller/inventory.controller.js';

const router=express.Router();
router.get('/:productId',getProductInventory);
router.post('/',createProductInventory);
router.patch('/:productId/stock',updateProductInventory);
router.post('/reserve',createReservation);
router.patch('/reserve/status',updateReservationStatus);
export default router;    