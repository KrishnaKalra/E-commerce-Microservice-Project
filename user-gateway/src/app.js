import express from 'express';
import config from '../config/index.js';
import router from './routes/index.js'
const app=express();
app.use(express.json());
app.use(router);
//console.log(router)
app.listen(config.PORT,()=>{
    console.log(`Listening to port ${config.PORT}`); 
});