// app.js
// const { connectProducer } = require('./kafka/producer');
// const orderRoutes = require('./routes/order.route');
import router from './routes/payment.route.js'
import express from 'express'
import config from '../config/index.js'
import authMiddleware from './authMiddleware/auth-middleware.js';
import { connectConsumer } from './kafka/consumer.js';
import { connectProducer } from './kafka/producer.js';
const app = express();
app.use(express.json()); 
app.use('/payment',authMiddleware, router);
// const start=async ()=>{
//    // await connectProducer();
//     app.listen(3000,()=>{
//     console.log("Listening Order on port 3000");
// });
// }
const runServer=()=>{
app.listen(config.PORT,()=>{
    console.log(`Listening to Port ${config.PORT}.`);
    
})
connectConsumer();
connectProducer();
}
runServer();
//start();