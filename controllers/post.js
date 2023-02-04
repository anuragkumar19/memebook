import asyncHandler from 'express-async-handler'
import Comment from '../models/Comment.js'
import Notification from '../models/Notification.js'
import Post from '../models/Post.js'
import { parseComment, parsePost } from '../utils/parser.js'

export const createPostWithImage = asyncHandler(async (req, res) => {
    const images = req.files.map((file) => file.path.replace( 'https://res.cloudinary.com/instavite/image/upload/', 'https://res.cloudinary.com/instavite/image/upload/c_scale,w_1080/' ))

    const { caption } = req.body

    const post = await Post.create({
        mediaType: 'image',
        media: images,
        caption,
        user: req.user._id,
    })

    res.json({ post })
})

export const createPostWithVideo = asyncHandler(async (req, res) => {
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

export const getSiglePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate(
        'user',
        'name username avatar'
    )

    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }

    res.json({
        post: parsePost(post, req.user),
    })
})

export const getPostComment = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)

    let { page, limit } = req.query

    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 20
    }

    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }

    const comments = await Comment.find({
        post: post._id,
    })
        .populate('user', 'name username avatar')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort('-createdAt')

    res.json({
        count: comments.length,
        comments: comments.map((comment) => parseComment(comment, req.user)),
    })
})

export const updatePost = asyncHandler(async (req, res) => {
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

    res.json({
        post: parsePost(post, req.user),
    })
})

export const deletePost = asyncHandler(async (req, res) => {
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

export const likePost = asyncHandler(async (req, res) => {
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

    if (post.user.toString() !== user.toString()) {
        await Notification.create({
            type: 'likePost',
            user: post.user,
            post: post._id,
            likedBy: user,
        })
    }

    await post.save()

    res.json({
        post: parsePost(post, req.user),
    })
})

export const unlikePost = asyncHandler(async (req, res) => {
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

    if (post.user.toString() !== user.toString()) {
        await Notification.findOneAndDelete({
            type: 'likePost',
            user: post.user,
            post: post._id,
            likedBy: user,
        })
    }

    await post.save()

    res.json({
        post: parsePost(post, req.user),
    })
})

export const commentOnPost = asyncHandler(async (req, res) => {
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

    if (post.user.toString() !== req.user._id.toString()) {
        await Notification.create({
            type: 'comment',
            user: post.user,
            post: post._id,
            comment: comment._id,
        })
    }

    await post.save()

    res.json({
        comment: {
            ...parseComment(comment, req.user),
            user: {
                name: req.user.name,
                username: req.user.username,
                avatar: req.user.avatar,
            },
        },
    })
})

export const savePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)

    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }

    const user = req.user

    if (user.savedPosts.includes(post._id)) {
        res.status(400)
        throw new Error('Already saved')
    }

    user.savedPosts.push(post._id)

    await user.save()

    res.json({ message: 'Post saved' })
})

export const unsavePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)

    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }

    const user = req.user

    if (!user.savedPosts.includes(post._id)) {
        res.status(400)
        throw new Error('Not saved yet')
    }

    user.savedPosts = user.savedPosts.filter(
        (savedPost) => savedPost.toString() !== post._id.toString()
    )

    await user.save()

    res.json({ message: 'Post unsaved' })
})

export const getPostForFeed = asyncHandler(async (req, res) => {
    let { page, limit } = req.query

    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 10
    }

    const posts = await Post.find({
        user: { $in: [...req.user.following, req.user._id] },
    })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name username avatar')

    res.json({
        posts: posts.map((post) => parsePost(post, req.user)),
        count: posts.length,
    })
})
