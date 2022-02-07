import asyncHandler from 'express-async-handler'
import Notification from '../models/Notification.js'

export const getNotifications = asyncHandler(async (req, res) => {
    let { page, limit } = req.query

    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 10
    }

    let notifications = await Notification.find({
        user: req.user._id,
    })
        .populate('followedBy', 'name username avatar')
        .populate('post', 'caption mediaType media user')
        .populate('comment', 'text user')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort('-createdAt')

    notifications = await Notification.populate(notifications, [
        {
            path: 'post.user',
            select: 'name username avatar',
        },
        {
            path: 'comment.user',
            select: 'name username avatar',
        },
    ])

    res.json({ notifications })
})

export const markNotificationAsSeen = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
        res.status(404)
        throw new Error('Notification not found')
    }

    if (notification.user.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error('Not authorized')
    }

    notification.seen = true
    await notification.save()

    res.json({ notification })
})
