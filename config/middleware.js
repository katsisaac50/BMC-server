const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('./index');

module.exports = (app) => {
  app.use(helmet());
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(bodyParser.json());
  app.use(rateLimit(RATE_LIMIT));
};
