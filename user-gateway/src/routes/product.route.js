import express from 'express';
import {  createProduct, deleteProduct, findProduct, getProducts, updateProduct } from '../contoller/product.controller.js'

const productRouter=express.Router();
productRouter.get('/',getProducts);
productRouter.get('/:id',findProduct);
productRouter.post('/',createProduct); 
productRouter.put('/:id',updateProduct);
productRouter.patch('/:id',updateProduct);
productRouter.delete('/:id',deleteProduct);
export default productRouter; 