import {Queue} from 'bullmq'
const emailQueue = new Queue('email', {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    
});

export { emailQueue };