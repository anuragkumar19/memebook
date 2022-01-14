import Joi from 'joi'

export const signUpSchema = Joi.object({
    name: Joi.string().required().min(3).max(40),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    username: Joi.string().required().min(3).max(40).alphanum(),
})

export const verifyEmailSchema = Joi.object({
    email: Joi.string().required().email(),
    otp: Joi.number().required(),
})
