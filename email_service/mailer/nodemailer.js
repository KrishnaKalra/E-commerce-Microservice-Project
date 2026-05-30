import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();
//console.log(process.env.GOOGLE_APP_PASSWORD);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kalrakrishna26@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD, // The 16-character App Password
    },
});


export {transporter};