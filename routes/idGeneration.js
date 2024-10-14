const express = require('express');
const db = require('../db');

const QRCode = require('qrcode');
const Jimp = require('jimp');

const { asyncHandler } = require('../middlewares/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    try {
        const codes = await db.getGeneratedCodes();
        res.send(codes);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}))

router.get('/generate', asyncHandler(async (req, res) => {
    try {
        const id = await generateId();
        const data = `FriendID: ${id}`;
        const qrCodeImg = await QRCode.toDataURL(data);
        db.saveGeneratedCode(id, qrCodeImg);
        res.send(`<img src="${qrCodeImg}" alt="QR Code"/>`);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}));

function generateUniqueId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

async function generateId() {
    let id = generateUniqueId();
    const existentIds = (await db.getGeneratedCodes()).map(code => code.friendId);
    while (existentIds.includes(id)) {
        id = generateUniqueId();
    }
    return id;
}

module.exports = router;