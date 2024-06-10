const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create logger instance
const logger = createLogger({
  level: 'info', // Log only if info level or less severe
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
  ],
});

module.exports = logger;