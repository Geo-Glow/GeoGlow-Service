const express = require('express');
const router = express.Router();

const friendsRoutes = require('./friends');

router.use('/friends', friendsRoutes);

module.exports = router;