const express = require('express');
const router = express.Router();
const {
    addItem,
    getItems
} = require('../controllers/itemController');
const upload = require('../utils/multerConfig');

router.post('/additem', upload.single('image'), addItem);
router.get('/getitems', getItems);
module.exports = router;