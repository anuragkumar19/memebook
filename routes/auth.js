import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import validate from '../middlewares/validate.js'
import User from '../models/User.js'
import { sendOtp } from '../utils/email.js'
import { genOtp } from '../utils/genOtp.js'
import { signUpSchema, verifyEmailSchema } from '../utils/validationSchema.js'

const router = Router()

router.post(
    '/signup',
    validate(signUpSchema),
    asyncHandler(async (req, res) => {
        const { name, username, email, password } = req.body

        let user = await User.findOne({ email })

        if (user && user.isEmailVerified) {
            res.status(400)
            throw new Error('Email already exists')
        }

        const checkUser = await User.findOne({ username })

        if (checkUser) {
            res.status(400)
            throw new Error('Username already exists')
        }

        const otp = genOtp()
        const otpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

        if (user) {
            user.name = name
            user.username = username
            user.password = password
            user.otp = otp
            user.otpExpiry = otpExpiry
            await user.save()
        } else {
            user = await User.create({
                name,
                username,
                email,
                password,
                otp,
                otpExpiry,
            })
        }

        await sendOtp(email, otp)

        res.json({ message: 'Signup successful' })
    })
)

router.post(
    '/verify',
    validate(verifyEmailSchema),
    asyncHandler(async (req, res) => {
        const { email, otp } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            res.status(400)
            throw new Error('Email not found')
        }

        if (user.isEmailVerified) {
            res.status(400)
            throw new Error('Email already verified')
        }

        if (!user.otp || user.otpExpiry < Date.now()) {
            res.status(400)
            throw new Error('OTP expired')
        }

        if (user.otp !== otp) {
            res.status(400)
            throw new Error('Invalid OTP')
        }

        user.isEmailVerified = true
        user.otp = null
        user.otpExpiry = null
        await user.save()

        res.json({ message: 'Email verified' })
    })
)

export default router
