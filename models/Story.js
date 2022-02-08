import mongoose from 'mongoose'

const ReactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reaction: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

const StorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            required: true,
        },
        media: {
            type: String,
            required: true,
        },
        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        reactions: [ReactionSchema],
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('Story', StorySchema)
