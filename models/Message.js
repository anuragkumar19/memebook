import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('Message', MessageSchema)
