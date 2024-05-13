import express from "express";
import employeeController from "../employee/employee.controller.js";
import verifyToken from "../../helpers/jwt_token.js";

const router = express.Router();

router.get("/",verifyToken, employeeController.getAllEmployee);
router.get("/:id",verifyToken, employeeController.getSingleEmployee);
router.patch("/:id",verifyToken, employeeController.updateEmployee);
router.put("/:id",verifyToken, employeeController.updateEmployee);
router.delete("/:id",verifyToken, employeeController.removeEmployee);

export default router;