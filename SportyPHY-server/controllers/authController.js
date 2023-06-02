const User = require('../models/userModel');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cloudinary = require('../utils/cloudinaryConfig');
const otpVerification = require('../models/otpVerificationModal');
const nodemailer = require('nodemailer');

dotenv.config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const validatePassword = (password) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

exports.register = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ userName: req.body.userName }, { email: req.body.email }],
    });

    if (existingUser) {
      return res.status(409).json({
        status: 'fail',
        message: 'User with the same username or email already exists',
      });
    } else {
      const isValidPassword = validatePassword(req.body.password);
      if (!isValidPassword) {
        return res.status(400).json({
          status: 'fail',
          message:
            'Please provide a strong password with a minimum of 8 characters, including at least 1 letter, 1 number, and 1 special symbol.',
        });
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const image = await cloudinary.uploader.upload(req.file.path);
      console.log(image);
      const newUser = new User({
        name: req.body.name,
        userName: req.body.userName,
        email: req.body.email,
        friends: [],
        password: hash,
        image: image.secure_url,
        cloudinary_id: image.public_id,
        interest: [],
        location: {
          type: 'Point',
          coordinates: [req.body.latitude, req.body.longitude],
        },
      });
      console.log(newUser);
      await newUser.save();
      let token = '';
      if (newUser) {
        token = jwt.sign({ id: newUser._id }, process.env.JWT);
        res.cookie('token', token);
      }
      res.status(200).json({
        status: 'success',
        user: newUser,
        message: 'User has been signed in!',
        token: token,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.body.userName });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password is incorrect',
      });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    const { password, isAdmin, ...otherDetails } = user._doc;

    res.cookie('token', token);
    res.status(200).json({
      status: 'success',
      message: 'User has been logged in!',
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.sendOtpVerificationEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(500).json({
        status: 'error',
        message: 'Email already taken.',
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    let existingOtpVerification = await otpVerification.findOne({
      email: email,
    });

    const saltRounds = 10;
    if (existingOtpVerification) {
      const hash = await bcrypt.hash(otp.toString(), saltRounds);
      existingOtpVerification.otp = hash;
      existingOtpVerification.createdAt = Date.now();
      await existingOtpVerification.save();
    } else {
      const hash = await bcrypt.hash(otp.toString(), saltRounds);
      const newOtpVerification = new otpVerification({
        email: email,
        otp: hash,
        createdAt: Date.now(),
      });
      await newOtpVerification.save();
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Your OTP for email verification is <b>${otp}</b>.\nIt is valid for only 1 hour.`,
    };

    transporter.sendMail(mailOptions);

    res.status(202).json({
      status: 'success',
      message: `OTP has been sent to your ${email}`,
      data: {
        email: email,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.matchOtp = async (req, res) => {
  try {
    const { email, otp } = req.params;

    const existingOtpVerification = await otpVerification.findOne({
      email: email,
    });

    if (!existingOtpVerification) {
      return res.status(404).json({
        status: 'error',
        message: 'OTP verification not found.',
      });
    }

    const isMatch = await bcrypt.compare(
      otp.toString(),
      existingOtpVerification.otp
    );

    if (isMatch) {
      return res.status(200).json({
        status: 'success',
        message: 'OTP matched. Verification successful.',
        data: email,
      });
    } else {
      // Invalid OTP
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP.',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
