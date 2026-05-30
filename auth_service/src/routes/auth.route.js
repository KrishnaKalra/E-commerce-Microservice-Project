import express from 'express';
import { authUser, createUser } from '../contoller/auth.controller.js';

const router=express.Router();
router.post('/sign-up',createUser);
router.post('/log-in',authUser);
export default router; 