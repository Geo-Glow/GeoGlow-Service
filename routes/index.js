const express = require('express');
const router = express.Router();

const friendsRoutes = require('./friends');
const messageRoutes = require('./messages');
const idGenerationRoutes = require('./idGeneration');
const dataRoutes = require('./data');

router.use('/friends', friendsRoutes);
router.use('/messages', messageRoutes);
router.use('/qrcodes', idGenerationRoutes);
router.use('/data', dataRoutes);

module.exports = router;
