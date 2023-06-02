const Message = require('../models/message');

exports.getmessages = async (req, res) => {
    const {roomId}=req.params;
    const message= await Message.find({roomId:roomId});
    res.status(200).json({
        status: 'success',
        data: {
            message,
        },
    });
}