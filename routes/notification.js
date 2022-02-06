import { Router } from 'express'
import {
    getNotifications,
    markNotificationAsSeen,
} from '../controllers/notifications.js'
import { validateParamsId } from '../middlewares/validateId.js'
import { userMiddleware } from '../middlewares/auth.js'

const router = Router()

router.use(userMiddleware)

router.get('/', getNotifications)

router.post('/:id', validateParamsId('id'), markNotificationAsSeen)

export default router
