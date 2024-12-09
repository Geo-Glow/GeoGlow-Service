const express = require('express');
const db = require('../db');

const { asyncHandler } = require('../middlewares/asyncHandler');

const router = express.Router();

router.get(
    '/',
    asyncHandler(async (req, res) => {
        let messages;
        const { toFriendId, fromFriendId, startTime, endTime } = req.query;
        try {
            const query = {};

            if (toFriendId) query.toFriendId = toFriendId;
            if (fromFriendId) query.fromFriendId = fromFriendId;

            if (startTime && endTime) {
                query.timestamp = {
                    $gte: new Date(parseInt(startTime)),
                    $lte: new Date(parseInt(endTime)),
                };
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
    })
);

module.exports = router;
