import {newWorker} from '../bullmq/worker.js'
import {connectConsumer} from './kafka/consumer.js'
const start=async()=>{
    try{
        console.log("Email Service Starting");
        await connectConsumer();
        await newWorker();
        console.log("Email service is running and listening to the events");
    }catch (err) {
    console.error('❌ Email Service failed to start', err);
    process.exit(1);
    }
}
start();