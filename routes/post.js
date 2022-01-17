import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { upload } from '../middlewares/upload.js'
import validate from '../middlewares/validate.js'
import { commentSchema, postSchema } from '../utils/validationSchema.js'
import Post from '../models/Post.js'
import { userMiddleware } from '../middlewares/auth.js'
import { validateParamsId } from '../middlewares/validateId.js'
import Comment from '../models/Comment.js'
import { parseComment, parsePost } from '../utils/parser.js'

const router = Router()

router.use(userMiddleware)

router.post(
    '/image',
    validate(postSchema),
    upload('image', 'images', true),
    asyncHandler(async (req, res) => {
        const images = req.files.map((file) => file.path)

        const { caption } = req.body

        const post = await Post.create({
            mediaType: 'image',
            media: images,
            caption,
            user: req.user._id,
        })

        res.json({ post })
    })
)

router.post(
    '/video',
    validate(postSchema),
    upload('video', 'videos', true),
    asyncHandler(async (req, res) => {
        const videos = req.files.map((file) => file.path)

        const { caption } = req.body

        const post = await Post.create({
            mediaType: 'video',
            media: videos,
            caption,
            user: req.user._id,
        })

        res.json({ post })
    })
)

router.get(
    '/:id',
    validateParamsId('id'),
    asyncHandler(async (req, res) => {
        const post = await Post.findById(req.params.id)

        if (!post) {
            res.status(404)
            throw new Error('Post not found')
        }

        res.json({ post: parsePost(post) })
    })
)

router.get(
    '/:id/comments',
    validateParamsId('id'),
    asyncHandler(async (req, res) => {
        const post = await Post.findById(req.params.id)

        if (!post) {
            res.status(404)
            throw new Error('Post not found')
        }

        const comments = await Comment.find({
            post: post._id,
        }).populate('user', 'name username avatar')

        res.json({ comments: comments.map((comment) => parseComment(comment)) })
    })
)

router.put(
    '/:id',
    validateParamsId('id'),
    validate(postSchema),
    asyncHandler(async (req, res) => {
        const post = await Post.findById(req.params.id)

        if (!post) {
            res.status(404)
            throw new Error('Post not found')
        }

        if (post.user.toString() !== req.user._id.toString()) {
            res.status(403)
            throw new Error('Unauthorized')
        }

        const { caption } = req.body

        post.caption = caption

        await post.save()

        res.json({ post })
    })
)

router.delete(
    '/:id',
    validateParamsId('id'),
    asyncHandler(async (req, res) => {
        const post = await Post.findById(req.params.id)

        if (!post) {
            res.status(404)
            throw new Error('Post not found')
        }

        if (post.user.toString() !== req.user._id.toString()) {
            res.status(403)
            throw new Error('Unauthorized')
        }

        await post.remove()

        post.comments.forEach(async (comment) => {
            await Comment.findByIdAndRemove(comment)
        })

        res.json({ message: 'Post deleted' })
    })
)

router.post(
    '/:id/like',
    validateParamsId('id'),
    asyncHandler(async (req, res) => {
        const post = await Post.findById(req.params.id)

        if (!post) {
            res.status(404)
            throw new Error('Post not found')
        }

        const user = req.user._id

        if (post.likes.includes(user)) {
            res.status(400)
            throw new Error('Already liked')
        }

        post.likes.push(user)

        await post.save()

        res.json({ post })
    })
)

router.post(
    '/:id/unlike',
    validateParamsId('id'),
    asyncHandler(async (req, res) => {
        const post = await Post.findById(req.params.id)

        if (!post) {
            res.status(404)
            throw new Error('Post not found')
        }

        const user = req.user._id

        if (!post.likes.includes(user)) {
            res.status(400)
            throw new Error('Not liked yet')
        }

        post.likes = post.likes.filter(
            (like) => like.toString() !== user.toString()
        )

        await post.save()

        res.json({ post })
    })
)

router.post(
    '/:id/comment',
    validateParamsId('id'),
    validate(commentSchema),
    asyncHandler(async (req, res) => {
        const post = await Post.findById(req.params.id)

        if (!post) {
            res.status(404)
            throw new Error('Post not found')
        }

        const { text } = req.body

        const comment = await Comment.create({
            text,
            user: req.user._id,
            post: post._id,
        })

        post.comments.push(comment._id)

        await post.save()

        res.json({ post })
    })
)

export default router
