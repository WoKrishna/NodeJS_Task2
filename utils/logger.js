import winston from 'winston';
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;
import fs from 'fs';
import path from 'path';

const logDir = "./logs";

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    format: combine(
        timestamp(),
        printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'combined.log') })
    ]
});

logger.add(new transports.Console({
    format: format.simple()
}));

export default logger;
