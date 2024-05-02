const express = require('express')
const jwtAuthenticate = require('../middleware/jwtAuthenticate')
const router = express.Router()
const mqtt = require('mqtt')
const ethers = require('ethers')

const EventEmitter = require('events')

const eventEmitter= new EventEmitter();

const contractAddress = process.env.contractAddress;
const privateKey = process.env.privateKey;
const infuraAPI = process.env.infuraApi;
const apiUrl = `https://sepolia.infura.io/v3/${infuraAPI}`

const contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "TrashLevelUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_level",
				"type": "uint256"
			}
		],
		"name": "updateTrashLevel",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllTrashData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "level",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct TrashCan.TrashData[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "trashData",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const provider = new ethers.JsonRpcProvider(apiUrl)
const signer = new ethers.Wallet(privateKey, provider)

const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer)

async function updateTrashLevel(level){

	try{
		const tx = await contractInstance.updateTrashLevel(level);
		await tx.wait();
        console.log("Transaction successful. Trash level updated.");
		getAllTrashData();

	} 
	catch(error){
		console.error("Error updating trash level:", error);
	}

}

async function getAllTrashData() {
    try {
		// Call the getAllTrashData function of the contract instance
		const data = await contractInstance.getAllTrashData();
		console.log("All trash level data:");
		data.forEach(entry => {
			const trashLevel = entry[0];
			const timestamp = new Date(Number(entry[1]) * 1000); // Convert Unix timestamp to milliseconds
			const today = new Date();
			const formattedTimestamp = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
			console.log(`Trash Level: ${trashLevel}, Timestamp: ${formattedTimestamp}`);
		});
	} catch (error) {
		console.error("Error getting all trash data:", error);
	}
	
}


const main = async = (level) =>{
	updateTrashLevel(level)
}

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


mqttClient.on('message', (topic, payload) => {

    try {
		const payloadString = payload.toString();
		const startIndex = payloadString.indexOf('"field1":"') + '"field1":"'.length;
		const endIndex = payloadString.indexOf('"', startIndex);
		const fieldValueString = payloadString.substring(startIndex, endIndex);
		const fieldValue = parseInt(fieldValueString);

		eventEmitter.emit('fieldValue', fieldValue)
		if(fieldValue <= 7) main(fieldValue)
		// console.log('Field1 value:', fieldValue);

    } catch (error) {
        console.error('Error parsing MQTT message:', error);
    }
});


router.get('/', jwtAuthenticate, (req, res) => {
    res.send(req.rootUser)
})


module.exports = {router, eventEmitter}
