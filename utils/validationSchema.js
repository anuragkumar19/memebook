import Joi from 'joi'

export const signUpSchema = Joi.object({
    name: Joi.string().trim().required().min(3).max(40),
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required().min(6),
    username: Joi.string().required().min(3).max(40).alphanum().lowercase(),
})

export const verifyEmailSchema = Joi.object({
    email: Joi.string().required().email().lowercase(),
    otp: Joi.number().required(),
})

export const loginSchema = Joi.object({
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required(),
})

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().required().email().lowercase(),
})

export const resetPasswordSchema = Joi.object({
    email: Joi.string().required().email().lowercase(),
    otp: Joi.number().required(),
    password: Joi.string().required().min(6),
})

export const updateBioSchema = Joi.object({
    bio: Joi.string().trim().max(200),
})

export const updateWebsiteSchema = Joi.object({
    website: Joi.string().trim().uri(),
})

export const updateNameSchema = Joi.object({
    name: Joi.string().trim().required().min(3).max(40),
})

export const updateUsernameSchema = Joi.object({
    username: Joi.string().trim().required().min(3).max(40).alphanum(),
})

export const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(6),
})
