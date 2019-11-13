const winston  = require('winston');
const fs = require('fs');
const path = require('path');
const logDir = 'log';
const moment = require("moment");

// Create the log directory if it does not exist
   if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = process.env.NODE_ENV === "production" ? path.join(logDir, 'results.log') : path.join(logDir, 'dev-results.log');

module.exports = winston.createLogger({
    transports: [
        new (winston.transports.Console)({
            // silent: !!process.env.TEST_ENV,
            // level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(info => {

                    const message = info[Symbol.for('splat')] ? info.message + ' - ' + info[Symbol.for('splat')][0] : info.message;

                    return `[${moment(info.timestamp).format("llll")}][PID=${process.pid}][${info.level}]: ${message} –– ${moment(info.timestamp).format("llll")}`;
                })
            )
    }),
    new winston.transports.File({ filename })
    ]
});