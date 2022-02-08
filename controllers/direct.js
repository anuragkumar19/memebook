import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Message from '../models/Message.js'

export const getChatUsers = asyncHandler(async (req, res) => {
    const messages = await Message.find({
        $or: [{ to: req.user._id }, { from: req.user._id }],
    }).sort('-createdAt')

    const users = messages.reduce((acc, message) => {
        if (!acc.includes(message.from.toString())) {
            acc.push(message.from.toString())
        }

        if (!acc.includes(message.to.toString())) {
            acc.push(message.to.toString())
        }

        return acc
    }, [])

    const usersData = await User.find({ _id: { $in: users } }).select(
        'name username avatar'
    )

    res.status(200).json({
        users: usersData.map((user) => ({
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            _id: user._id,
            lastMessage: messages.find((message) => {
                if (message.to.toString() === user._id.toString()) {
                    return message
                }

                return false
            }),
        })),
    })
})

export const getMessages = asyncHandler(async (req, res) => {
    const { id } = req.params

    let { limit, page } = req.query

    if (!limit) {
        limit = 20
    }

    if (!page) {
        page = 1
    }

    const messages = await Message.find({
        $or: [
            { to: req.user._id, from: id },
            { from: req.user._id, to: id },
        ],
    })
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('from', 'name username avatar')
        .populate('to', 'name username avatar')

    res.status(200).json({
        messages,
    })
})
