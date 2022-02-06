import { Router } from 'express'
import {
    commentOnPost,
    createPostWithImage,
    createPostWithVideo,
    deletePost,
    getPostComment,
    getPostForFeed,
    getSiglePost,
    likePost,
    savePost,
    unlikePost,
    unsavePost,
    updatePost,
} from '../controllers/post.js'
import { userMiddleware } from '../middlewares/auth'
import { upload } from '../middlewares/upload'
import validate from '../middlewares/validate'
import { validateParamsId } from '../middlewares/validateId'
import { commentSchema, postSchema } from '../utils/validationSchema'

const router = Router()

router.use(userMiddleware)

router.post(
    '/image',
    validate(postSchema),
    upload('image', 'images', true),
    createPostWithImage
)

router.post(
    '/video',
    validate(postSchema),
    upload('video', 'videos', true),
    createPostWithVideo
)

router.get('/feed', getPostForFeed)

router.get('/:id', validateParamsId('id'), getSiglePost)

router.get('/:id/comments', validateParamsId('id'), getPostComment)

router.put('/:id', validateParamsId('id'), validate(postSchema), updatePost)

router.delete('/:id', validateParamsId('id'), deletePost)

router.post('/:id/like', validateParamsId('id'), likePost)

router.post('/:id/unlike', validateParamsId('id'), unlikePost)

router.post('/:id/save', validateParamsId('id'), savePost)

router.post('/:id/unsave', validateParamsId('id'), unsavePost)

router.post(
    '/:id/comment',
    validateParamsId('id'),
    validate(commentSchema),
    commentOnPost
)

export default router
