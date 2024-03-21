const User = require('../models/user')
const jwt = require('jsonwebtoken')

const jwtAuthenticate = async(req,res,next) =>{

    try {

        console.log('incheking');

        const token = req.cookies.jwtToken;

        console.log(`token is ${token}`);

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        
        const  rootUser = await User.findOne({_id: verifyToken._id, "tokens.token": token})
        
        if(!rootUser) throw new Error('User not Found')
        req.token = token;
        req.rootUser = rootUser; 
        req.userId = rootUser._id;

        console.log('di si ', req.userId);

        next();

    } catch (err) {
        res.status(401).send('Unauthorized')
    }


}

module.exports = jwtAuthenticate;