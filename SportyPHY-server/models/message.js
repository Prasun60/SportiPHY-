const mongoose = require('mongoose');

const messageschema = new mongoose.Schema(
  {
    messages: {
      type: String,
      required: true,
    },
    name:{
      type:String,
      required:true,
    },
    senderId: {
      type: String,
      required: true,
    },
    ownedByCurrentUser:{
      type:Boolean,
      default:false,
    },
    roomId:{
      type:String,
      required:true,
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('message', messageschema);
module.exports = Message;