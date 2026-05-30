import express from 'express';
import config from '../config/index.js';
import router from './routes/auth.route.js';
import { connectProducer } from './kafka/producer.js';
const app=express();
app.use(express.json());
app.use(router);
app.listen(config.PORT,()=>{
    console.log(`Listening to port ${config.PORT}`);
    connectProducer();
});