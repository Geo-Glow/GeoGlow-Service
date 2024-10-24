const express = require('express');
const db = require('../db');

const { asyncHandler } = require('../middlewares/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    try {
        db.retrieveStudyData()
            .then(data => {
                return res.json(data);
            })
            .catch(error => {
                return res.status(500).json({ error: error })
            })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err })
    }
}));

module.exports = router;