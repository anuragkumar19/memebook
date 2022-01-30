import asyncHandler from 'express-async-handler'
import Comment from '../models/Comment.js'
import Post from '../models/Post.js'
import { parseComment } from '../utils/parser.js'

export const updateComment = asyncHandler(async (req, res) => {
    const { id } = req.params

    const comment = await Comment.findById(id)

    if (!comment) {
        res.status(404)
        throw new Error('Not found')
    }

    if (req.user._id.toString() !== comment.user.toString()) {
        res.status(403)
        throw new Error('Forbidden')
    }

    const { text } = req.body

    comment.text = text

    await comment.save()

    res.json({
        comment: parseComment(comment, req.user),
    })
})

export const deleteComment = asyncHandler(async (req, res) => {
    const { id } = req.params

    const comment = await Comment.findById(id)

    if (!comment) {
        res.status(404)
        throw new Error('Not found')
    }

    if (req.user._id.toString() !== comment.user.toString()) {
        res.status(403)
        throw new Error('Forbidden')
    }

    await comment.remove()

    const post = await Post.findById(comment.post)

    if (!post) {
        res.status(400)
        throw new Error('Post not found')
    }

    post.comments = post.comments.filter(
        (c) => c.toString() !== comment._id.toString()
    )

    await post.save()

    res.json({ message: 'Comment deleted' })
})

export const likeComment = asyncHandler(async (req, res) => {
    const { id } = req.params

    const comment = await Comment.findById(id)

    if (!comment) {
        res.status(404)
        throw new Error('Not found')
    }

    const user = req.user._id

    if (comment.likes.includes(user)) {
        res.status(400)
        throw new Error('Already liked')
    }

    comment.likes.push(user)

    await comment.save()

    res.json({ comment: parseComment(comment, req.user) })
})

export const unlikeComment = asyncHandler(async (req, res) => {
    const { id } = req.params

    const comment = await Comment.findById(id)

    if (!comment) {
        res.status(404)
        throw new Error('Not found')
    }

    const user = req.user._id

    if (!comment.likes.includes(user)) {
        res.status(400)
        throw new Error('Not liked yet')
    }

    comment.likes = comment.likes.filter(
        (like) => like.toString() !== user.toString()
    )

    await comment.save()

    res.json({ comment: parseComment(comment, req.user) })
})
