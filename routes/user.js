import { Router } from 'express'
import {
    follow,
    getFollowers,
    getFollowing,
    getLoggedInUser,
    getPostOfUser,
    getUserByUsername,
    searchUser,
    unfollow,
    updateBio,
    updateName,
    updatePassword,
    updateUsername,
    updateWebsite,
} from '../controllers/user.js'
import { userMiddleware } from '../middlewares/auth.js'
import { upload } from '../middlewares/upload.js'
import validate from '../middlewares/validate.js'
import {
    updateBioSchema,
    updateNameSchema,
    updatePasswordSchema,
    updateWebsiteSchema,
} from '../utils/validationSchema.js'

const router = Router()

// Allow access to these routes only if user is authenticated
router.use(userMiddleware)

router.get('/', getLoggedInUser)

router.get('/search', searchUser)

router.put('/bio', validate(updateBioSchema), updateBio)

router.put('/website', validate(updateWebsiteSchema), updateWebsite)

router.put('/name', validate(updateNameSchema), updateName)

router.put('/username', updateUsername)

router.put('/password', validate(updatePasswordSchema), updatePassword)

router.put('/avatar', upload('image', 'avatar', false))

router.get('/:username', getUserByUsername)

router.get('/:username/posts', getPostOfUser)

router.get('/:username/followers', getFollowers)

router.get('/:username/following', getFollowing)

router.post('/:username/follow', follow)

router.post('/:username/unfollow', unfollow)

export default router
