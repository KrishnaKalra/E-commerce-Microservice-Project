import express from 'express';
import { authUser, createUser } from '../contoller/auth.controller.js';

const authRouter=express.Router();
authRouter.post('/sign-up',createUser);
authRouter.post('/log-in',authUser);
export default authRouter; 