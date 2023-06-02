const Item = require('../models/itemModel');
const cloudinary = require('../utils/cloudinaryConfig');

exports.addItem = async (req, res) => {
    try {
        const image = await cloudinary.uploader.upload(req.file.path);
        const newItem = await Item.create({
        ...req.body,
        image: image.secure_url,
        cloudId: image.public_id,
        });
        res.status(201).json({
        status: 'success',
        data: {
            item: newItem,
        },
        });
    } catch (err) {
        res.status(400).json({
        status: 'fail',
        message: err.message,
        });
    }    
};

exports.getItems = async (req, res) => {    
    try {
        const items = await Item.find();
        res.status(200).json({
        status: 'success',
        data: {
            items,
        },
        });
    } catch (err) {
        res.status(400).json({
        status: 'fail',
        message: err.message,
        });
    }
}