import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import logger from "../utils/logger.js";

mongoose.connect(process.env.MONGODB_URL, { dbName: process.env.DB_NAME }).then(() => {
    logger.info("MongoDb is connected.....")
}).catch((err) => {
    logger.error(`Error:${err.message}`)
});
