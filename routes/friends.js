const express = require('express');
const { asyncHandler } = require('../middlewares/asyncHandler');
const db = require('../db');

const { fillColors, hexToRgb } = require("../utils/colorUtils");
const { sendColors } = require("../utils/mqtt");

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

router.post('/', asyncHandler(async (req, res) => {
    const { friendId, panelIds, groupId } = req.body;
    await db.postFriend({ friendId, panelIds, groupId });
    res.send(friendId, panelIds, groupId);
}));

const mapColorsToTileIds = (tileIds, colors) => {
    let finalColors;
    if (tileIds.length > colors.length) {
        finalColors = fillColors(colors, tileIds.length);
    } else {
        finalColors = colors;
    }

    const rgbColors = finalColors.map(hexToRgb);

    return tileIds.reduce((acc, tileId, index) => {
        acc[tileId] = rgbColors[index];
        return acc;
    }, {});
};

router.post('/:friendId/colors', asyncHandler(async (req, res) => {
    try {
        const { colors } = req.body;
        const { friendId } = req.params;
        const friend = await db.getFriend(friendId);

        if (!friend || !friend.tileIds) {
            throw new Error("Friend not found");
        }

        const colorMapping = mapColorsToTileIds(friend.tileIds, colors);

        sendColors(friendId, colorMapping);
        res.sendStatus(200);

    } catch (err) {
        if (err.message === "Friend not found") {
            res.sendStatus(404);
        } else {
            res.sendStatus(500);
        }
    }
}));

module.exports = router;