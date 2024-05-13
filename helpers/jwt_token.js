import jwt from "jsonwebtoken";
import HttpError from "http-errors";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {
    if (!req.headers['authorization']) return next(HttpError.Unauthorized());
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return next(HttpError.Unauthorized());
            } else {
                return next(HttpError.Unauthorized(err.message));
            }
        }
        req.payload = payload;
        next();
    });
}

export default verifyToken;

