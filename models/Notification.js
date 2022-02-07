import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ['likePost', 'comment', 'follow', 'likeComment'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required() {
                return (
                    this.type === 'likePost' ||
                    this.type === 'likeComment' ||
                    this.type === 'comment'
                )
            },
        },
        comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            required() {
                return this.type === 'likeComment' || this.type === 'comment'
            },
        },
        followedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required() {
                return this.type === 'follow'
            },
        },
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required() {
                return this.type === 'likePost' || this.type === 'likeComment'
            },
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

export default mongoose.model('Notification', NotificationSchema)
