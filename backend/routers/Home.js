const express = require('express')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')
const router = express.Router()

const mqtt = require('mqtt')
const WebSocket = require('ws')

const mqttConnection = {
    clientId: process.env.CLIENT_ID_MQTT,
    username: process.env.USERNAME_MQTT,
    password: process.env.PASSWORD_MQTT
}

const mqttClient = mqtt.connect('mqtt://mqtt.thingspeak.com', mqttConnection)
const mqttTopic = 'trash-bin-data'
const wss = new WebSocket.Server({port:8080})

wss.on('connection', (ws) =>{
    console.log('websocket client connected')

    mqttClient.subscribe(mqttTopic)

    

})

router.get('/', jwtAuthenticate, (req,res) =>{
    res.send(req.rootUser)


})

module.exports = router;