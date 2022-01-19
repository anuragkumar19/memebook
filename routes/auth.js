import { Router } from 'express'
import {
    forgotPassword,
    logIn,
    refreshToken,
    resetPassword,
    signUp,
    verifyEmail,
} from '../controllers/auth.js'
import validate from '../middlewares/validate.js'
import {
    forgotPasswordSchema,
    loginSchema,
    resetPasswordSchema,
    signUpSchema,
    verifyEmailSchema,
} from '../utils/validationSchema.js'

const router = Router()

router.post('/signup', validate(signUpSchema), signUp)

router.post('/verify', validate(verifyEmailSchema), verifyEmail)

router.post('/login', validate(loginSchema), logIn)

router.post('/refresh', refreshToken)

router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)

router.post('/reset-password', validate(resetPasswordSchema), resetPassword)

export default router
