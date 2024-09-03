const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    port: process.env.PORT || 3000,
    mqttUrl: process.env.MQTT_URL,
    mqttPort: process.env.MQTT_PORT || 1883,
    mongoUri: process.env.MONGO_URI,
};