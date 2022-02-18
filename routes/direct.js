import { Router } from 'express'
import { validateParamsId } from '../middlewares/validateId.js'
import { userMiddleware } from '../middlewares/auth.js'
import {
    getChatUsers,
    getMessages,
    getUnSeenMessages,
    markAsSeen,
} from '../controllers/direct.js'

const router = Router()

router.use(userMiddleware)

router.get('/users', getChatUsers)

router.get('/count', getUnSeenMessages)

router.post('/:id', validateParamsId('id'), markAsSeen)

router.get('/:id/messages', validateParamsId('id'), getMessages)

export default router
