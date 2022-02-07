import { Router } from 'express'
import {
    getSubscriptions,
    subscribe,
    unsubscribe,
} from '../controllers/push.js'
import { userMiddleware } from '../middlewares/auth.js'
import validate from '../middlewares/validate.js'
import { validateParamsId } from '../middlewares/validateId.js'
import { subscribeSchema } from '../utils/validationSchema.js'

const router = Router()

router.use(userMiddleware)

router.get('/', getSubscriptions)

router.post('/subscribe', validate(subscribeSchema), subscribe)

router.delete('/unsubscribe/:id', validateParamsId('id'), unsubscribe)

export default router
