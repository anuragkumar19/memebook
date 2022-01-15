import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { userMiddleware } from '../middlewares/auth.js'
import {
    updateBioSchema,
    updateNameSchema,
    updatePasswordSchema,
    updateWebsiteSchema,
} from '../utils/validationSchema.js'
import validate from '../middlewares/validate.js'
import User from '../models/User.js'

const router = Router()

// Allow access to these routes only if user is authenticated
router.use(userMiddleware)

router.get(
    '/',
    asyncHandler(async (req, res) => {
        const user = req.user

        user.password = undefined
        user.otp = undefined
        user.otpExpiry = undefined

        res.status(200).json({
            user,
        })
    })
)

router.put(
    '/bio',
    validate(updateBioSchema),
    asyncHandler(async (req, res) => {
        const { bio } = req.body

        const user = req.user

        user.bio = bio

        await user.save()

        res.status(200).json({
            message: 'Bio updated successfully',
        })
    })
)

router.put(
    '/website',
    validate(updateWebsiteSchema),
    asyncHandler(async (req, res) => {
        const { website } = req.body

        const user = req.user

        user.website = website

        await user.save()

        res.status(200).json({
            message: 'Website updated successfully',
        })
    })
)

router.put(
    '/name',
    validate(updateNameSchema),
    asyncHandler(async (req, res) => {
        const { name } = req.body

        const user = req.user

        user.name = name

        await user.save()

        res.status(200).json({
            message: 'Name updated successfully',
        })
    })
)

router.put(
    '/username',
    asyncHandler(async (req, res) => {
        const { username } = req.body

        const user = req.user

        const checkUser = await User.findOne({ username })

        if (checkUser) {
            res.status(400)
            throw new Error('Username already exists')
        }

        user.username = username

        await user.save()

        res.status(200).json({
            message: 'Username updated successfully',
        })
    })
)

router.put(
    '/password',
    validate(updatePasswordSchema),
    asyncHandler(async (req, res) => {
        const { oldPassword, newPassword } = req.body

        const user = req.user

        if (!user.comparePassword(oldPassword)) {
            res.status(400)
            throw new Error('Incorrect old password')
        }

        user.password = newPassword

        await user.save()

        res.status(200).json({
            message: 'Password updated successfully',
        })
    })
)

// Avatar upload
//....

export default router
