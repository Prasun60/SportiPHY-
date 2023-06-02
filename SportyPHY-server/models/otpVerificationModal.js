const mongoose = require('mongoose');
const otpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600000,
  },
});
const otpVerification = mongoose.model(
  'otpVerification',
  otpVerificationSchema
);

module.exports = otpVerification;
