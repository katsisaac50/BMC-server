const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');
const { ROLES } = require('../config');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  passwordChangedAt: Date,
  passwordResetToken: String,
  isActive: { type: Boolean, default: true },
  role: {
    type: String,
    enum: ROLES,
    default: 'ADMIN'
  },
});

// Encrypt password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function() {
  console.log('JWT_SECRET in login:', JWT_SECRET, typeof JWT_SECRET, JWT_SECRET.length);
  return jwt.sign({ id: this._id, role: this.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
    algorithm: 'HS256'
  });
};

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);