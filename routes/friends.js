const express = require('express');
const { asyncHandler } = require('../middlewares/asyncHandler');
const db = require('../db');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    const groupId = req.query.groupId;
    const data = groupId ? await db.getAllFriendsInGroup(groupId) : await db.getAllFriends();
    res.status(200).json(data);
}));

router.get('/:friendId', asyncHandler(async (req, res) => {
    try {
        const friendId = req.params.friendId;
        const data = await db.getFriend(friendId);
        res.status(200).json(data);
    } catch (err) {
        if (err.message === "Friend not found") {
            res.sendStatus(404);
        } else {
            res.sendStatus(500);
        }
    }
}));

module.exports = router;