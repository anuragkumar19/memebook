import { Router } from 'express'
import {
    getNotifications,
    getUnseenNotifications,
    markNotificationAsSeen,
} from '../controllers/notification.js'
import { validateParamsId } from '../middlewares/validateId.js'
import { userMiddleware } from '../middlewares/auth.js'

const router = Router()

router.use(userMiddleware)

router.get('/', getNotifications)

router.get('/unseen', getUnseenNotifications)

router.post('/:id', validateParamsId('id'), markNotificationAsSeen)

export default router
