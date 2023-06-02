// const {instance} = require("../server.js");
const crypto = require("crypto");
const Payment = require("../models/paymentModel.js")
const dotenv = require("dotenv");
const Razorpay = require('razorpay');

dotenv.config();
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
  });



exports.checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 10),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

exports.paymentVerification = async (req, res) => {
    res.redirect(
      "https://ssportyphy-server.el.r.appspot.com/buynsell"
    );
};