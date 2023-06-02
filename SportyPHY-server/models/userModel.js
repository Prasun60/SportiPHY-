const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    minlength: [6, 'A  name must have more or equal then 6 characters'],
    maxlength: [40, 'A  name must have less or equal then 40 characters'],
  },
  userName: {
    type: String,
    required: [true, 'Please tell us your user name!'],
    unique: true,
    minlength: [6, 'A user name must have more or equal then 6 characters'],
    maxlength: [20, 'A user name must have less or equal then 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  friends: {
    type: Array,
    default: [],
  },
  getRequests: {
    type: Array,
    default: [],
  },
  sentRequests: {
    type: Array,
    default: [],
  },
  image: String,
  interest: Array,
  password: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (value) {
    //     const regex =
    //       /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //     return regex.test(value);
    //   },
    //   message:
    //     'Please provide a strong password with a minimum of 8 characters, including at least 1 letter, 1 number, and 1 special symbol.',
    // },
  },
  cloudinary_id: String,
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  invitations: {
    type: [String],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
