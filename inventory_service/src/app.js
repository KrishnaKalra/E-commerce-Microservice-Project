import express from "express";
import config from "../config/index.js";
import router from "./routes/inventory.route.js";
import authMiddleware from "./authMiddleware/auth-middleware.js";
import cron from "node-cron";
import { reservationCleanupJob } from "./jobs/reservation-cleanup.js";
import { connectConsumer } from "./kafka/consumer.js";
import { connectProducer } from "./kafka/producer.js";
const app = express();
app.use(express.json());
app.use("/inventory", authMiddleware, router);
const runServer = () => {
    app.listen(config.PORT, () => {
        console.log(`Listening to port ${config.PORT}`);
    });

    cron.schedule("*/5 * * * *", () => {
        reservationCleanupJob();
    });
    connectConsumer();
    connectProducer();
};

runServer();