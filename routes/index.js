import { Router } from 'express'
import authRouter from './auth.js'
import userRouter from './user.js'
import postRouter from './post.js'
import commentRouter from './comment.js'

const router = Router()

// Auth Routes
router.use('/auth', authRouter)

// User Routes
router.use('/user', userRouter)

// Post Routes
router.use('/post', postRouter)

// Comment Router
router.use('/comment', commentRouter)

router.get('/', (_req, res) => res.json({ message: 'API is running!' }))

export default router
