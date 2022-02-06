import mongoose from 'mongoose'
import Notification from './Notification.js'

const PostSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        caption: {
            type: String,
        },
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            required: true,
        },
        media: {
            type: [String],
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    { timestamps: true }
)

PostSchema.pre('remove', async function (next) {
    await Notification.deleteMany({
        post: this._id,
    })

    next()
})

export default mongoose.model('Post', PostSchema)
