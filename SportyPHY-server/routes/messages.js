const express = require('express');
const router = express.Router();
const {
    getmessages,
  } = require('../controllers/messagecontroller.js');

  router.get('/:roomId', getmessages);

  module.exports = router;