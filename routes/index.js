const express = require('express');
const router = express.Router();

const friendsRoutes = require('./friends');
const messageRoutes = require('./messages');
const idGenerationRoutes = require('./idGeneration');

router.use('/friends', friendsRoutes);
router.use('/messages', messageRoutes);
router.use('/generate', idGenerationRoutes);

module.exports = router;