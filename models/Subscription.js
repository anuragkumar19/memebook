import mongoose from 'mongoose'

const SubscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        subscription: {
            type: Object,
            required: true,
        },
        identifier: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

export default mongoose.model('Subscription', SubscriptionSchema)
