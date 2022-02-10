import Joi from 'joi'

const usernameValidator = (value, helpers) => {
    if (!/^[a-zA-Z0-9._]+$/.test(value)) {
        return helpers.error('any.custom', {
            message:
                'Username must contain only letters, numbers, periods, and underscores.',
        })
    }

    return value
}

export const signUpSchema = Joi.object({
    name: Joi.string().trim().required().min(3).max(40),
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required().min(6),
    username: Joi.string()
        .required()
        .min(3)
        .max(40)
        .lowercase()
        .custom(usernameValidator)
        .invalid('admin', 'memebook', 'search', 'saved'),
})

export const verifyEmailSchema = Joi.object({
    email: Joi.string().required().email().lowercase(),
    otp: Joi.number().required(),
})

export const loginSchema = Joi.object({
    emailOrUsername: Joi.string().trim().required().lowercase(),
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
    bio: Joi.string().trim().max(200).allow(''),
})

export const updateWebsiteSchema = Joi.object({
    website: Joi.string().trim().uri().allow(''),
})

export const updateNameSchema = Joi.object({
    name: Joi.string().trim().required().min(3).max(40),
})

export const updateUsernameSchema = Joi.object({
    username: Joi.string()
        .trim()
        .required()
        .min(3)
        .max(40)
        .lowercase()
        .custom(usernameValidator)
        .invalid('admin', 'memebook', 'search', 'saved'),
})

export const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(6),
})

export const postSchema = Joi.object({
    caption: Joi.string().trim().allow(''),
})

export const commentSchema = Joi.object({
    text: Joi.string().trim().required().min(1).max(200),
})

export const subscribeSchema = Joi.object({
    subscription: Joi.required(),
    identifier: Joi.string().required(),
})
