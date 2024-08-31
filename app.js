const express = require('express');
const mqtt = require('mqtt');
const config = require('./config/config');
const db = require('./db');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = config.port;

//const mqttClient = mqtt.connect(config.mqttUrl);

app.use(express.json());
app.use('/', router);
app.use(errorHandler);

(async () => {
    try {
        await db.connectToDatabase();
        console.log("Connected to database");

        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });

        const gracefulShutdown = async (signal) => {
            console.log(`Received signal to terminate: ${signal}`);
            try {
                await db.closeConnection();
                console.log("Database connection closed");
            } catch (error) {
                console.error("Error closing database connection", error);
            }
            process.exit(0);
        };

        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }
})();

module.exports = app;