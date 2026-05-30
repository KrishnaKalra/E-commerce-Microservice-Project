import express from 'express';
import { createProductInventory, getProductInventory, updateProductInventory } from '../contoller/inventory.controller.js';

const inventoryRouter=express.Router();
inventoryRouter.get('/:productId',getProductInventory);
inventoryRouter.post('/',createProductInventory);
inventoryRouter.patch('/:productId/stock',updateProductInventory);
export default inventoryRouter; 