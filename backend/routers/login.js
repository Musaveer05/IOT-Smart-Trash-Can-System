const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            console.log("User Does not exists");
            return res.json({ok:true, body:{exists: false, message:'User Does not Exist'}});
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (validPassword) {
            const token = await user.generateAuthToken();
            console.log(token);
            res.cookie("jwtToken", token, {
                expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // for 30 days
                httpOnly: true
            });
            res.json({ok:true, body:{valid:true, message:'You are Logged In'}})
        }
        else {
            res.json({ok:true, body:{valid:false, message:'Invalid Credentials'}})
        }

    }
    catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

})


module.exports = router;