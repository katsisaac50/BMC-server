const dotenv = require ( 'dotenv');

dotenv.config();

 const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
 const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
 const COOKIE_EXPIRE = parseInt(process.env.COOKIE_EXPIRE || '30') * 24 * 60 * 60 * 1000;
 const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bismillahmedicalcenter';
 const NODE_ENV = process.env.NODE_ENV || 'development';
 const PORT = process.env.PORT || 5000;
 module.exports = {
  JWT_SECRET,
  JWT_EXPIRE,
  COOKIE_EXPIRE,
  MONGO_URI,
    NODE_ENV,
    PORT,
 };