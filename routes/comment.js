import { Router } from 'express'
import {
    deleteComment,
    likeComment,
    unlikeComment,
    updateComment,
} from '../controllers/comment.js'
import { userMiddleware } from '../middlewares/auth.js'
import { validateParamsId } from '../middlewares/validateId.js'

const router = Router()

router.use(userMiddleware)

router.put('/:id', validateParamsId('id'), updateComment)

router.delete('/:id', validateParamsId('id'), deleteComment)

router.post('/:id/like', validateParamsId('id'), likeComment)

router.post('/:id/unlike', validateParamsId('id'), unlikeComment)

export default router
