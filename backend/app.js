if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require('body-parser')
const cookie = require('cookie-parser')

const dbUrl = process.env.DB_URL;

mongoose.set('strictQuery', false);

mongoose.connect(dbUrl, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
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


// app.get('/Home', jwtAuthenticate,  (req,res) =>{
//     res.send(req.rootUser);
// })

app.use('/Home', require('./routers/Home'))
app.use('/register', require('./routers/register'))
app.use('/login', require('./routers/login'))


const port = 3001;
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})