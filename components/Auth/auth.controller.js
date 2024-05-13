import Employee from "../../models/employee.model.js";
import { registerSchema, loginSchema } from "../../helpers/validation.js";
import HttpError from "http-errors";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import logger from "../../utils/logger.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFERESH_TOKEN = process.env.REFERESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFERESH_TOKEN });

const sendRegisterMail = async (Email) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: Email,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFERESH_TOKEN,
                accessToken: accessToken
            }
        });
        const mailOptions = {
            from: "Krishna <" + Email + ">",
            to: "krishna20.mahadevwala@gmail.com", // other email
            subject: "Register Confirmation E-mail.",
            text: "Your record saved sucessfully...!!",
            html: "<h1>Registeration Successfull !!</h1></br><h2>Here is Code for Authentication:123456</h2>"
        };
        const result = await transport.sendMail(mailOptions);
        logger.info("Mail sent successfully..!!");
        return result;
    } catch (error) {
        logger.error(`Error getting: ${error.message}`);
        return error;
    }
}

const registerEmployee = async (req, res, next) => {
    try {
        const { email } = req.body;
        const isExist = await Employee.findOne({ email: email });
        if (isExist) throw HttpError.Conflict(`${email} is already existing in database.`);
        const result = await registerSchema.validateAsync(req.body);
        const user = new Employee(result);
        const savedUser = await user.save();
        sendRegisterMail(savedUser.email);
        res.send(savedUser);
    } catch (error) {
        logger.error(`Error getting: ${error.message}`);
        if (error.isjoi === true) error.status = 422;
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body);
        const user = await Employee.findOne({ email: result.email });
        if (!user) throw HttpError.NotFound("User not regeistered!!!!");
        const isMatch = await user.isInvalidPassword(result.password);
        if (!isMatch) throw createError.Unauthorized('Password not valid!!!');
        const accessToken = await signAccessToken(user);
        const refreshToken = await signRefreshToken(user);
        res.send({ accessToken, refreshToken });
    } catch (error) {
        logger.error(`Error getting: ${error.message}`);
        if (error.isjoi === true) return next(HttpError.BadRequest("Invalid email/pwd..."));
        next(error);
    }
}

const signAccessToken = async (user) => {
    const { ACCESS_TOKEN_SECRET, JWT_EXPIRES_IN } = process.env;
    const options = {
        expiresIn: JWT_EXPIRES_IN,
        issuer: "exapmle.com",
        audience: "User"
    };
    const accessToken = jwt.sign({ userId: user?._id }, ACCESS_TOKEN_SECRET, options);
    return accessToken;
}

const signRefreshToken = async (user) => {
    const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN } = process.env;
    const options = {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        issuer: "exapmle.com",
        audience: 'UserRefresh'
    };
    const refreshToken = jwt.sign({ userId: user?._id }, REFRESH_TOKEN_SECRET, options);
    return refreshToken;
}

const refereshToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const refreshToken = bearerToken[1];
        if (!refreshToken) {
            return next(HttpError.Unauthorized('No refresh token provided'));
        }
        const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET, JWT_EXPIRES_IN } = process.env;
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return next(HttpError.Unauthorized('Invalid refresh token'));
            }
            const accessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: JWT_EXPIRES_IN });
            res.json({ accessToken });
        });
    } catch (error) {
        next(error);
    }
}

const verifyAccount = async (req, res) => {
    try {
        const { code } = req.params;
        if (code != "123456") {
            const error = new Error('Code not matched to login');
            logger.error(`Error getting: ${error.message}`);
        } else {
            res.send("Succesfully Varified the Account!!!")
        }
    } catch (error) {
        logger.error(`Error getting: ${error.message}`);
    }
}

export default { registerEmployee, login, refereshToken, verifyAccount };