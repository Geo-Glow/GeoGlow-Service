const mqtt = require("mqtt");
const config = require("../config/config");

const options = {
    host: config.mqttUrl,
    port: config.mqttPort,
};

const client = mqtt.connect(options);

// Event listeners for MQTT client
client.on('connect', function () {
    console.log('Connected to MQTT broker');
});

client.on('error', function (error) {
    console.error('MQTT connection error: ', error);
});

function sendColors(friendId, colors) {
    const payload = JSON.stringify(colors);

    const topic = `GeoGlow/${friendId}/color`;

    client.publish(topic, payload, { qos: 1 }, (err) => {
        if (!err) return true
        console.error('Failed to publish message', err);
        return false;
    });
}

module.exports = {
    client,
    sendColors,
}