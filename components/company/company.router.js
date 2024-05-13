import express from "express";
import companyController from "../company/company.controller.js";
import verifyToken from "../../helpers/jwt_token.js";
const router = express.Router();

router.get("/",verifyToken, companyController.getAllCompany);
router.get("/:id",verifyToken, companyController.getSingleCompany);
router.post("/",verifyToken, companyController.addNewCompany);
router.patch("/:id",verifyToken, companyController.updateCompany);
router.put("/:id",verifyToken, companyController.updateCompany);
router.delete("/:id",verifyToken, companyController.removeCompany);

export default router;