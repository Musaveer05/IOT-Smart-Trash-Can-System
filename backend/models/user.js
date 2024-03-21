const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const user = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});


user.methods.generateAuthToken = async function(){

    try{
        let tokenOg = jwt.sign({_id: this._id}, process.env.JWT_SECRET);
        this.tokens = this.tokens.concat({token:tokenOg}) 
        await this.save();
        return tokenOg;
    }
    catch(err){
        console.log(err);
    }

}

module.exports = mongoose.model('User', user);

