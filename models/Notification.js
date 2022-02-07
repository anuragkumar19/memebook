import mongoose from 'mongoose'
import webPush from 'web-push'
import Subscription from './Subscription.js'

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

NotificationSchema.post('save', async function (doc) {
    const subs = await Subscription.find({ user: doc.user })

    await doc.populate('followedBy', 'name username avatar')
    await doc.populate('post', 'caption mediaType media user')
    await doc.populate('comment', 'text user')
    await doc.populate('likedBy', 'name username avatar')

    subs.forEach(async (sub) => {
        const payload = {
            type: doc.type,
            user: doc.user,
            post: doc.post,
            comment: doc.comment,
            followedBy: doc.followedBy,
            likedBy: doc.likedBy,
            _id: doc._id,
            createdAt: doc.createdAt,
        }

        try {
            await webPush.sendNotification(
                sub.subscription,
                JSON.stringify(payload)
            )
        } catch (err) {
            //...
        }
    })
})

export default mongoose.model('Notification', NotificationSchema)
