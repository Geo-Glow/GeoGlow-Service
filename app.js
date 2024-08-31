require('dotenv').config();
const express = require('express');
const db = require('./db');
const mqtt = require('mqtt');

const app = express();
const port = process.env.PORT || 3000;

const mqttUrl = process.env.MQTT_URL || null;
if (!mqttUrl) {
    throw new Error("MQTT_URL is not defined in environment variables");
}
const mqttClient = mqtt.connect(mqttUrl);

app.use(express.json());

function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

const hexToRgb = (hex) => {
    // Ensure we have a valid hex color code
    hex = hex.startsWith('#') ? hex.slice(1) : hex;

    // Short notation check
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    if (hex.length !== 6) {
        throw new Error("Invalid hex color code");
    }

    // Convert hex to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
};

(async () => {
    try {
        await db.connectToDatabase();
        console.log("Connected to database");

        app.get('/', (req, res) => {
            res.send("Hello world");
        });

        /*

        app.get('/devices', asyncHandler(async (req, res) => {
            const data = await db.getAllDevices();
            res.json(data);
        }));

        app.post('/friends/colors', async (req, res) => {
            const { friendIds, colors } = req.body;
            const rgbColors = colors.map(hexToRgb);
            const result = [];

            for (const friendId of friendIds) {
                const device = await db.getDeviceIdByFriendId(friendId);
                const panelIds = device.panelIds;
                // Duplicate colors if not enough (more tiles than colors)
                const extendedColors = [];
                for (let i = 0; i < panelIds.length; i++) {
                    extendedColors.push(rgbColors[i % rgbColors.length]);
                }

                const colorPalette = panelIds.reduce((acc, panelId, index) => {
                    acc[panelId] = extendedColors[index];
                    return acc;
                }, {});

                mqttClient.publish(`GeoGlow/${friendId}/${device.deviceId}/color`, JSON.stringify(colorPalette))
            }
            res.send().status(200)
        })*/

        // GETs all friends
        app.get('/friends', asyncHandler(async (req, res) => {
            const groupId = req.query.groupId;
            const data = groupId ? await db.getAllFriendsInGroup(groupId) : await db.getAllFriends();
            res.status(200).json(data);
        }));

        // GETs all information about friend with friendId
        app.get('/friends/:friendId', asyncHandler(async (req, res) => {
            try {
                const friendId = req.params.friendId;
                data = await db.getFriend(friendId);
                res.status(200).json(data);
            } catch (err) {
                if (err.message === "Friend not found") {
                    res.sendStatus(404);
                } else {
                    res.sendStatus(500);
                }
            }
        }));

        // POSTs (sends) colors to friend with friendId
        app.post('/friends/:friendId/colors', asyncHandler(async (req, res) => {
            // TODO();
        }));

        app.patch('/friends/:friendId', asyncHandler(async (req, res) => {
            // TODO();
        }));

        // Catch-all error handler
        app.use((err, req, res, next) => {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        });

        // Start the server
        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await db.closeConnection();
                console.log("Database connection closed");
            } catch (error) {
                console.error("Error closing database connection", error);
            }
            process.exit(0);
        });
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1); // Exit with a failure code
    }
})();

module.exports = app;