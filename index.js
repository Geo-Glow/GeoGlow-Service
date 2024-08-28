const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');

function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

(async () => {
    try {
        await db.connectToDatabase();
        console.log("Connected to database");

        app.get('/', (req, res) => {
            res.send("Hello world");
        });

        app.get('/friends', asyncHandler(async (req, res) => {
            const data = await db.getAllFriends();
            res.json(data);
        }));

        app.get('/friends/online', asyncHandler(async (req, res) => {
            const data = await db.getAllOnlineFriends();
            res.json(data);
        }));

        app.get('/devices', asyncHandler(async (req, res) => {
            const data = await db.getAllDevices();
            res.json(data);
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