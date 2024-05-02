if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require('body-parser')
const cookie = require('cookie-parser')
const http = require('http')
const socketIo = require('socket.io')


const homeRouter = require('./routers/Home')

const server = http.createServer(app);
const io = socketIo(server);


const dbUrl = `mongodb://localhost:27017/TrashCan` || process.env.DB_URL;

mongoose.set('strictQuery', false);

mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 60000, // 1 minute timeout
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", ()=>{
    console.log("Database Connected");
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookie())

const event = homeRouter.eventEmitter;

event.on('fieldValue', (fieldValue)=>{
    // console.log('in app.js file',fieldValue)
    io.emit('fieldValue', fieldValue)
})

app.use('/Home', homeRouter.router)
app.use('/register', require('./routers/register'))
app.use('/login', require('./routers/login'))


const port = 3001;
server.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})
