import Company from "../../models/company.model.js";
import HttpError from "http-errors";
import { companySchema } from "../../helpers/validation.js";
import mongoose from "mongoose";
import logger from "../../utils/logger.js";

const getAllCompany = async (req, res, next) => {
    try {
        const { status, email, name, address, search } = req.query;
        const filters = [];
        if (address) filters.push({ $match: { address: address } });
        if (email) filters.push({ $match: { email: email } });
        if (name) filters.push({ $match: { name: name } });
        if (status) filters.push({ $match: { status: status } });
        if (search) {
            const regex = new RegExp(search, 'i');
            filters.push({
                $match: {
                    $or: [
                        { status: regex },
                        { address: regex },
                        { email: regex },
                        { name: regex }
                    ]
                }
            });
        }
        if (filters?.length) {
            const company = await Company.aggregate(filters);
            if (!company) logger.error("No Records Found!!!")
            res.send(company);
        } else {
            const result = await Company.find(req.query, { __v: 0 });
            if (!result) throw HttpError(404, "No companys defined...!");
            res.send(result);
        }
    } catch (error) {
        logger.error(`${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}

const addNewCompany = async (req, res, next) => {
    try {
        const companyData = await companySchema.validateAsync(req.body);
        const result = await new Company(companyData).save();
        res.send(result);
    } catch (error) {
        logger.error(`Error getting: ${error.message}`);
        if (error.name === 'ValidationError') {
            next(HttpError(422, error.message));
            return;
        }
        if (error.isjoi === true) error.status = 422;
        next(error);
    }
}

const updateCompany = async (req, res, next) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        const option = { new: true };
        const result = await Company.findByIdAndUpdate(id, payload, option);
        if (!result) throw HttpError(404, "Company not available in database....");
        res.send(result);
    } catch (error) {
        logger.error(`Error getting: ${error.message}`);
        if (error instanceof mongoose.CastError) {
            next(HttpError(400, "Invalid ID..!!!"));
            return;
        }
        if (error.isjoi === true) error.status = 422;
        next(error);
    }
}

const getSingleCompany = async (req, res, next) => {
    const id = req.params.id;
    try {
        const comp = await Company.findById(id);
        if (!comp) throw HttpError(404, "Company not available in database....");
        res.send(comp);
    } catch (error) {
        logger.error(`Error getting: ${error.message}`);
        if (error instanceof mongoose.CastError) {
            next(HttpError(400, "Invalid ID..!!!"));
            return;
        }
        if (error.isjoi === true) error.status = 422;
        next(error);
    }
}

const removeCompany = async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await Company.findByIdAndDelete(id);
        if (!result) throw HttpError(404, "Company not available in database....");
        res.send(result);
    } catch (error) {
        logger.error(`Error getting: ${error.message}`);
        if (error instanceof mongoose.CastError) {
            next(HttpError(400, "Invalid ID..!!!"));
            return;
        }
        if (error.isjoi === true) error.status = 422;
        next(error);
    }
}

export default { getAllCompany, addNewCompany, updateCompany, getSingleCompany, removeCompany };