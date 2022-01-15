import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const userMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        res.status(401)
        throw new Error('No token provided')
    }

    const accessToken = token.split(' ')[1]

    if (!accessToken) {
        res.status(401)
        throw new Error('Invalid token')
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded._id)

        if (!user) {
            res.status(401)
            throw new Error('Invalid token')
        }

        req.user = user
        next()
    } catch (err) {
        res.status(401)
        throw new Error('Invalid token')
    }
})
