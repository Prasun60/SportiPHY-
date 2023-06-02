const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: [6, 'A  name must have more or equal then 6 characters'],
    maxlength: [40, 'A  name must have less or equal then 40 characters'],
    required: true,
  },
  adminName: {
    type: String,
    minlength: [6, 'A  name must have more or equal then 6 characters'],
    maxlength: [20, 'A  name must have less or equal then 20 characters'],
  },
  desc: {
    type: String,
    minlength: [10, 'Description must have more or equal then 10 characters'],
    maxlength: [90, 'Description have less or equal then 40 characters'],
  },
  creator: {
    type: String,
    required: [true, "Creator can't be null"],
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  players: {
    type: [Object],
    validate: {
      validator: function (array) {
        const maxSize = this.maxSize || 1;
        return array.length <= maxSize;
      },
      message: (props) =>
        `Array length must be less than or equal to ${props.maxSize}`,
    },
  },
  image: {
    type: String,
    default: '',
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
  status: {
    //type enum
    type: String,
    enum: ['open', 'closed', 'In a match'],
    default: 'closed',
  },
  roomId: {
    type: String,
    default: '',
  },
  visibility:{
    type: String,
    enum: ['Public', 'Private'],
  },
  invitations:{
    type: [String]
  },
  invitationLink: String,
  type: String,
  maxSize: Number,
});

groupSchema.pre('save', function (next) {
  const randomString = crypto.randomBytes(16).toString('hex');

  if (!this.invitationLink)
    this.invitationLink = crypto
      .createHash('sha256')
      .update(randomString)
      .digest('hex');

  next();
});

module.exports = mongoose.model('Groups', groupSchema);
