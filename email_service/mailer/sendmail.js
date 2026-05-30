import { createNewUserMail } from '../emails/newUser.email.js';
import { createOrderConfirmedMail, createOrderFailedMail } from '../emails/order.email.js';
import {transporter} from './nodemailer.js'
const sendnewUserMail=async (job)=>{  
    const {to}=job;
    const message=createNewUserMail(to);
    //console.log(message);
    await transporter.sendMail(message);
    //console.log('hi');
}
const sendOrderConfirmedMail=async(job)=>{
    const {to,name,id,amount}=job;
    console.log('hi order confirmed');
    const message=createOrderConfirmedMail(to,name,id,amount);
    await transporter.sendMail(message);
}

const sendOrderFailedMail=async(job)=>{
    const {to,name,orderid}=job;
    const message=createOrderFailedMail(to,name,orderid);
    await transporter.sendMail(message);
}
export { sendnewUserMail,sendOrderConfirmedMail,sendOrderFailedMail };