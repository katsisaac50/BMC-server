

// This is a simple logger utility using the 'winston' library
// to log messages to the console and a file.
// It formats the log messages with a timestamp and log level.
// You can customize the log level and format as needed.
// This logger utility is useful for debugging and logging errors
// in your application. In a production environment, you will
// likely want to customize the logger to log to a file or
// service like Loggly or Splunk.

// In your app.js or main server file

const logger = require('./utils/logger');

// Use the logger to log messages in your application
// Example of logging an info message:
// logger.info('Application has started');

// // Example of logging an error:
// app.use((err, req, res, next) => {
//   logger.error(`Error occurred: ${err.message}`);
//   next(err);
// });

// // You can also log requests:
// app.use((req, res, next) => {
//   logger.info(`Request received: ${req.method} ${req.url}`);
//   next();
// });


const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

module.exports = logger;

