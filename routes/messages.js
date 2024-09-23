const express = require('express');
const db = require('../db');

const { asyncHandler } = require('../middlewares/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    let messages;
    const { toFriendId, fromFriendId } = req.query;
    try {
        const query = {}

        if (toFriendId && !fromFriendId) {
            query.toFriendId = toFriendId;
        } else if (!toFriendId && fromFriendId) {
            query.fromFriendId = fromFriendId;
        } else if (toFriendId && fromFriendId) {
            query.toFriendId = toFriendId;
            query.fromFriendId = fromFriendId;
        }

        if (!toFriendId && !fromFriendId) {
            messages = await db.getAllMessages();
        } else {
            messages = await db.getMessageWithQuery(query);
        }

        res.status(200).json(messages);
    } catch (err) {
        if (err) res.sendStatus(500);
    }
}))

module.exports = router;