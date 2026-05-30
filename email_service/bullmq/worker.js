import {Worker} from 'bullmq'
import { sendnewUserMail, sendOrderConfirmedMail, sendOrderFailedMail } from '../mailer/sendmail.js'
import EVENTS from '../../constants/event.js';
const newWorker=()=>{
    return new Worker('email',async job=>{
        console.log('hello data')
        job=job.data;
        console.log(job);
        if(job.topic==EVENTS.USER_CREATED)
            sendnewUserMail(job.event);
        else if(job.topic==EVENTS.ORDER_CONFIRMED){
            sendOrderConfirmedMail(job.event);
        }
        else if(job.topic==EVENTS.PAYMENT_FAILED){
            sendOrderFailedMail(job.event);
        }
    },{
        concurrency:5,
        connection:{
            host:process.env.REDIS_HOST,
            port:process.env.REDIS_PORT
        }
    });
}

export { newWorker };