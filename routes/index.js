import { Router } from 'express'
import authRouter from './auth.js'
import commentRouter from './comment.js'
import postRouter from './post.js'
import userRouter from './user.js'
import notificationRouter from './notification.js'
import pushRouter from './push.js'

const router = Router()

// Auth Routes
router.use('/auth', authRouter)

// User Routes
router.use('/user', userRouter)

// Post Routes
router.use('/post', postRouter)

// Comment Router
router.use('/comment', commentRouter)

// Notification Router
router.use('/notification', notificationRouter)

// Push Router
router.use('/push', pushRouter)

router.get('/', (_req, res) => res.json({ message: 'API is running!' }))

export default router
