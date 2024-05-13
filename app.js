import express from "express";
import { initRoutes } from "./config/router.js";

import dotenv from "dotenv";
import "./helpers/init_mongodb.js";
import "./helpers/keys.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...!`);
    initRoutes(app);
});