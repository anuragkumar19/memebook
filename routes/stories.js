import { Router } from 'express'
import { validateParamsId } from '../middlewares/validateId.js'
import { userMiddleware } from '../middlewares/auth.js'
import { upload } from '../middlewares/upload.js'
import {
    createStoryWithImage,
    createStoryWithVideo,
    deleteStory,
    getSigleStory,
    getStoryForFeed,
    react,
} from '../controllers/stories.js'
import validate from '../middlewares/validate.js'
import { commentSchema } from '../utils/validationSchema.js'

const router = Router()

router.use(userMiddleware)

router.post('/image', upload('image', 'image', false), createStoryWithImage)

router.post('/video', upload('video', 'video', false), createStoryWithVideo)

router.get('/feed', getStoryForFeed)

router.get('/:id', validateParamsId('id'), getSigleStory)

router.delete('/:id', validateParamsId('id'), deleteStory)

router.post(
    '/:id/react',
    validateParamsId('id'),
    validate(commentSchema),
    react
)

export default router
