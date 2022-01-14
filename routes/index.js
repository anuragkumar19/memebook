import { Router } from 'express'
import authRouter from './auth.js'

const router = Router()

// Auth Routes
router.use('/auth', authRouter)

router.get('/', (_req, res) => res.json({ message: 'API is running!' }))

export default router
