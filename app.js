const express = require('express');
const app = express();
const configMiddleware = require('./config/middleware');
const routes = require('./routes');
const errorHandler = require('./utils/errorHandler');

// Middleware
configMiddleware(app);

// Routes
app.use('/api', routes);

console.log('Error handler type:', typeof errorHandler);

// Error handling
app.use(errorHandler);

module.exports = app;
