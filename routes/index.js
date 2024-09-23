const express = require('express');
const router = express.Router();

const friendsRoutes = require('./friends');
const messageRoutes = require('./messages');

router.use('/friends', friendsRoutes);
router.use('/messages', messageRoutes);

module.exports = router;