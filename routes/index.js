import { Router } from 'express'
import authRouter from './auth.js'
import userRouter from './user.js'

const router = Router()

// Auth Routes
router.use('/auth', authRouter)

// User Routes
router.use('/user', userRouter)

router.get('/', (_req, res) => res.json({ message: 'API is running!' }))

export default router
