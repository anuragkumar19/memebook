import asyncHandler from 'express-async-handler'
import webPush from 'web-push'
import Subscription from '../models/Subscription.js'

export const subscribe = asyncHandler(async (req, res) => {
    const { subscription, identifier } = req.body

    try {
        await webPush.sendNotification(
            subscription,
            JSON.stringify({ message: 'Subscribed!' })
        )

        const subscriptionModel = await Subscription.create({
            user: req.user._id,
            subscription,
            identifier,
        })

        res.json({ message: 'Subscribed!' })
    } catch (err) {
        res.status(400)
        throw new Error('Subscription failed')
    }
})

export const unsubscribe = asyncHandler(async (req, res) => {
    const id = req.params.id

    await Subscription.findByIdAndDelete(id)

    res.json({ message: 'Unsubscribed!' })
})

export const getSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({ user: req.user._id })

    res.json({ subscriptions })
})
