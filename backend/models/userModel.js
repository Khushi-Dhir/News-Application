const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String,default: ''},
    otpExpiry: { type: Number,default: 0},
    resetotp: { type: String,default: ''},
    resetotpExpiry: { type: Number,default: 0}
  });
  
  const User = mongoose.model.User || mongoose.model('User', userSchema);
  module.exports = User;