import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import validate from '../middlewares/validate.js'
import User from '../models/User.js'
import { sendOtp } from '../utils/email.js'
import { genOtp } from '../utils/genOtp.js'
import {
    forgotPasswordSchema,
    loginSchema,
    resetPasswordSchema,
    signUpSchema,
    verifyEmailSchema,
} from '../utils/validationSchema.js'
import jwt from 'jsonwebtoken'

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

router.post(
    '/login',
    validate(loginSchema),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            res.status(400)
            throw new Error('Email not found')
        }

        if (!user.isEmailVerified) {
            res.status(400)
            throw new Error('Email not verified')
        }

        if (user.comparePassword(password)) {
            const tokens = user.generateAuthToken()
            res.json({ tokens })
        } else {
            res.status(400)
            throw new Error('Invalid password')
        }
    })
)

router.post(
    '/refresh',
    asyncHandler(async (req, res) => {
        const token = req.header('Authorization')
        console.log(token)
        if (!token) {
            res.status(401)
            throw new Error('No token provided')
        }

        const refreshToken = token.split(' ')[1]

        if (!refreshToken) {
            res.status(401)
            throw new Error('Invalid token')
        }

        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            )
            const user = await User.findById(decoded._id)

            if (!user) {
                res.status(401)
                throw new Error('Invalid token')
            }

            const accessToken = user.generateAccessToken()
            res.json({ accessToken })
        } catch (err) {
            res.status(401)
            console.log(err)
            throw new Error('Invalid token')
        }
    })
)

router.post(
    '/forgot-password',
    validate(forgotPasswordSchema),
    asyncHandler(async (req, res) => {
        const { email } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            res.status(400)
            throw new Error('Email not found')
        }

        if (!user.isEmailVerified) {
            res.status(400)
            throw new Error('Email not verified')
        }

        const otp = genOtp()
        const otpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes

        user.otp = otp
        user.otpExpiry = otpExpiry
        await user.save()

        await sendOtp(email, otp)

        res.json({ message: 'OTP sent' })
    })
)

router.post(
    '/reset-password',
    validate(resetPasswordSchema),
    asyncHandler(async (req, res) => {
        const { email, otp, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            res.status(400)
            throw new Error('Email not found')
        }

        if (!user.isEmailVerified) {
            res.status(400)
            throw new Error('Email not verified')
        }

        if (!user.otp || user.otpExpiry < Date.now()) {
            res.status(400)
            throw new Error('OTP expired')
        }

        if (user.otp !== otp) {
            res.status(400)
            throw new Error('Invalid OTP')
        }

        user.password = password
        user.otp = null
        user.otpExpiry = null
        await user.save()

        res.json({ message: 'Password reset successful' })
    })
)

export default router
