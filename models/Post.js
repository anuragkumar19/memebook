import mongoose from 'mongoose'

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

export default mongoose.model('Post', PostSchema)
