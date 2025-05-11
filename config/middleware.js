const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('./index');
const cookieParser = require('cookie-parser');




module.exports = (app) => {
  app.use(helmet());
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(rateLimit(RATE_LIMIT));
};
