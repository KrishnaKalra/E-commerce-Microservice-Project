// app.js
// const { connectProducer } = require('./kafka/producer');
// const orderRoutes = require('./routes/order.route');
import router from './routes/order.route.js'
import express from 'express'
import config from '../config/index.js'
import authMiddleware from './authMiddleware/auth-middleware.js';
import { connectProducer } from './kafka/producer.js';
import { connectConsumer } from './kafka/consumer.js';
const app = express();
app.use(express.json());
app.use('/order', authMiddleware, router);
// const start=async ()=>{
//    // await connectProducer();
//     app.listen(3000,()=>{
//     console.log("Listening Order on port 3000");
// });
// }
const startService = async () => {
    app.listen(config.PORT, () => {
        console.log(`Listening to Port ${config.PORT}.`);
    });
    await connectProducer();
    await connectConsumer();
}

startService();
//start();