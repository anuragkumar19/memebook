import mongoose from 'mongoose'
import { Socket } from 'socket.io'
import Message from '../models/Message.js'
import User from '../models/User.js'

/**
 * @param {Socket} socket
 */
export const socketHandler = (socket) => {
    // Join room
    socket.join(socket.user._id.toString())

    // Send message
    socket.on('sendMessage', async (data) => {
        if (!data) return

        let { to, text } = data

        if (!to || typeof to !== 'string') return

        if (typeof text !== 'string') return

        text = text.trim()

        if (!text) return

        if (!mongoose.isValidObjectId(to)) return

        const user = await User.findById(to)

        if (!user) return

        if (user._id.toString() === socket.user._id.toString()) return

        let message = await Message.create({
            text,
            from: socket.user._id,
            to,
        })

        message = await Message.populate(message, [
            {
                path: 'from',
                select: 'name avatar username',
            },
            { path: 'to', select: 'name avatar username' },
        ])

        socket.to(to).emit('message', message)
        socket.to(socket.user._id.toString()).emit('message', message)
    })
}
