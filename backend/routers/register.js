const express = require('express')
const router = express.Router()
const User = require('../models/user')
const JoiSchema = require('../userDefined/validations')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        res.json({ ok: true, body: { exists: true } });
        console.log("Email Already Exists");
    }
    else {
        const validResult = JoiSchema.validate({
            email: email,
            password: password
        });

        const hashPassword = await bcrypt.hash(password, 12);

        if (validResult.error) {
            // console.log(validResult.error);
            console.log("Invalid Details -from Backend");
            res.json({ ok: true, body:{valid:false, message:'Enter Valid Credentias'}});
        }
        else {
            const user = new User({
                email: email,
                password: hashPassword
            });
            await user.save();
            console.log("user saved");
            res.json({ ok: true, body: {valid:true, message: 'Registration Successfull'} });
        }
    }

});

module.exports = router;



