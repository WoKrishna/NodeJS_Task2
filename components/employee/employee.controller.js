import HttpError from "http-errors";
import mongoose from "mongoose";
import Employee from "../../models/employee.model.js";
import logger from "../../utils/logger.js";

const getAllEmployee = async (req, res, next) => {
    try {
        const { designation, email, name, search } = req.query;
        const filters = [];
        if (designation) filters.push({ $match: { designation: designation } });
        if (email) filters.push({ $match: { email: email } });
        if (name) {
            const regex = new RegExp(name, 'i');
            filters.push({ $match: { $or: [{ firstName: regex }, { lastName: regex }] } });
        }
        if (search) {
            const regex = new RegExp(search, 'i');
            filters.push({
                $match: {
                    $or: [
                        { firstName: regex },
                        { lastName: regex },
                        { designation: regex },
                        { email: regex }
                    ]
                }
            });
        }
        if (filters?.length) {
            const employees = await Employee.aggregate(filters);
            if (!employees) logger.error("No Records Found!!!")
            res.send(employees);
        } else {
            const result = await Employee.find(req.query, { __v: 0 });
            if (!result) throw HttpError(404, "No Employees defined...!");
            res.send(result);
        }
    } catch (error) {
        logger.error(`Error getting: ${error.message}`);
        console.log("Errro..", error);
    }
}

const updateEmployee = async (req, res, next) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        const option = { new: true };
        const result = await Employee.findByIdAndUpdate(id, payload, option);
        if (!result) throw HttpError(404, "Employee not available in database....");
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

const getSingleEmployee = async (req, res, next) => {
    const id = req.params.id;
    try {
        const comp = await Employee.findById(id);
        if (!comp) throw HttpError(404, "Employee not available in database....");
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

const removeEmployee = async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await Employee.findByIdAndDelete(id);
        if (!result) throw HttpError(404, "Employee not available in database....");
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

export default { getAllEmployee, updateEmployee, getSingleEmployee, removeEmployee };