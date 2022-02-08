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

    let usersData = await User.find({ _id: { $in: users } }).select(
        'name username avatar'
    )

    usersData = usersData.filter(
        (user) => user._id.toString() !== req.user._id.toString()
    )

    res.status(200).json({
        users: usersData.map((user) => ({
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            _id: user._id,
            lastMessage: messages.find((message) => {
                if (
                    message.from.toString() === user._id.toString() ||
                    message.to.toString() === user._id.toString()
                ) {
                    return message
                }

                return false
            }),
        })),
    })
})

export const getUnSeenMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({ to: req.user._id, seen: false })

    let users = messages.map((message) => message.from.toString())

    users = [...new Set(users)]

    res.json({
        count: users.length,
    })
})

export const getMessages = asyncHandler(async (req, res) => {
    const { id } = req.params

    const messages = await Message.find({
        $or: [
            { to: req.user._id, from: id },
            { from: req.user._id, to: id },
        ],
    })
        .sort('+createdAt')
        .populate('from', 'name username avatar')
        .populate('to', 'name username avatar')

    res.status(200).json({
        messages,
    })
})

export const markAsSeen = asyncHandler(async (req, res) => {
    const { id } = req.params

    await Message.updateMany(
        { to: req.user._id, from: id, seen: false },
        { $set: { seen: true } }
    )

    res.status(200).json({
        message: 'Messages marked as seen',
    })
})
