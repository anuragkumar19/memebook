import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
)

CommentSchema.pre('remove', async function (next) {
    await Notification.deleteMany({
        comment: this._id,
    })

    next()
})

export default mongoose.model('Comment', CommentSchema)
