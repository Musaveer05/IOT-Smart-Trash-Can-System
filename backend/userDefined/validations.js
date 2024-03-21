const Joi = require('joi');

const schema = Joi.object({

    email: Joi.string()
        .email({ minDomainSegments: 1, tlds: { allow: ['com'] } }),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')),
})
    .with('email', 'password')

module.exports = schema;