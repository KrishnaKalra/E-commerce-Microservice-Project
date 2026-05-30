import express from "express";
import config from "../config/index.js";
import router from "./routes/product.route.js";
import authMiddleware from "./authMiddleware/auth-middleware.js";
import { connectProducer } from "./kafka/producer.js";

const app = express();
app.use(express.json());
app.use("/product", authMiddleware, router);
const startService = () => {
    app.listen(config.PORT, () => {
        console.log(`Listening to port ${config.PORT}`);
    });
    connectProducer();
};
startService();