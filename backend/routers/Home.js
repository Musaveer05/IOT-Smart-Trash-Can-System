const express = require('express')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')
const router = express.Router()

const mqtt = require('mqtt')
const mqttConnection = {
    clientId: process.env.CLIENT_ID_MQTT,
    username: process.env.USERNAME_MQTT,
    password: process.env.PASSWORD_MQTT,
    clean: true,
    connectTimeout: 4000
}


const mqttClient = mqtt.connect('mqtt://mqtt3.thingspeak.com', mqttConnection)
const mqttTopic = "channels/2480503/subscribe"


mqttClient.on('error', (error) => {
    console.error('MQTT client error:', error);
})


mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(mqttTopic, (err) => {
        if (err) {
            console.error('Error subscribing to MQTT topic:', err);
        } else {

            console.log('Subscribed to MQTT topic:', mqttTopic);

        }
    });
});


mqttClient.on('message', (mqttTopic, payload) => {
    console.log('Received Message:', mqttTopic, payload.toString())
})

router.get('/', jwtAuthenticate, (req,res) =>{
    res.send(req.rootUser)
})

module.exports = router;
