import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required()
});

export const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required().pattern(new RegExp(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/)),
    password: Joi.string().required(),
    designation: Joi.string().valid('MANAGER', 'TEAM_LEADER', 'DEVELOPER').required(),
    companyId: Joi.string().required(),
    isVerified: Joi.boolean().required()
});

export const companySchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().pattern(new RegExp(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)),
    address: Joi.object({
      line1: Joi.string().required(),
      line2: Joi.string().allow(''),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      zip: Joi.number().integer().required()
    }),
    contact: Joi.string().pattern(/^\d{10}$/).required(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').required()
  });