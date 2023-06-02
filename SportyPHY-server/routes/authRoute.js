const express = require('express');
const {
  register,
  login,
  sendOtpVerificationEmail,
  matchOtp,
} = require('../controllers/authController.js');
const router = express.Router();
const upload = require('../utils/multerConfig');

router.post('/register', upload.single('image'), register);
router.post('/login', login);
router.post('/sendotp/:email', sendOtpVerificationEmail);
router.post('/compare/:email/:otp', matchOtp);

module.exports = router;
