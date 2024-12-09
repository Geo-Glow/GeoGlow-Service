const mqtt = require('mqtt');
const config = require('../config/config');

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

function sendColors(friendId, colors, fromFriendColor) {
    return new Promise((resolve, reject) => {
        let payload = { ...colors, fromFriendColor };
        payload = JSON.stringify(payload);
        const topic = `GeoGlow/${friendId}/color`;

        client.publish(topic, payload, { qos: 1 }, (err) => {
            if (err) {
                console.error('Failed to publish message', err);
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

module.exports = {
    client,
    sendColors,
};
