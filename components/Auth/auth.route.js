import express from "express";
import authController from "../Auth/auth.controller.js";

const router = express.Router();

router.post("/register", authController.registerEmployee);
router.post("/authenticate", authController.login);
router.get("/refresh-token", authController.refereshToken);
router.get("/account-verify/:code", authController.verifyAccount);

export default router;