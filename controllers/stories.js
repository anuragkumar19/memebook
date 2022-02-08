import asyncHandler from 'express-async-handler'
import Story from '../models/Story.js'
import { parseStory } from '../utils/parser.js'

export const createStoryWithImage = asyncHandler(async (req, res) => {
    let story = await Story.create({
        mediaType: 'image',
        media: req.file.path,
        user: req.user._id,
    })

    res.json({ story })
})

export const createStoryWithVideo = asyncHandler(async (req, res) => {
    const story = await Story.create({
        mediaType: 'video',
        media: req.file.path,
        user: req.user._id,
    })

    res.json({ story })
})

export const getStoryForFeed = asyncHandler(async (req, res) => {
    const stories = await Story.find({
        user: { $in: [req.user._id, ...req.user.following] },
        // Less than 24 hours
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
        .sort('+createdAt')
        .populate('user', 'name username avatar')

    const usersStory = {}
    const otherStory = []

    stories.forEach((story) => {
        if (story.user._id.toString() === req.user._id.toString()) {
            usersStory.user = story.user
            usersStory.stories = [
                ...(usersStory.stories || []),
                parseStory(story, req.user),
            ]
        } else {
            const haveUser = otherStory.find(
                (item) => item.user._id.toString() === story.user._id.toString()
            )

            if (haveUser) {
                haveUser.stories = [
                    ...haveUser.stories,
                    parseStory(story, req.user),
                ]
            } else {
                otherStory.push({
                    user: story.user,
                    stories: [parseStory(story, req.user)],
                })
            }
        }
    })

    res.json({ stories: [...usersStory.stories, ...otherStory] })
})

export const getSigleStory = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id).populate(
        'user',
        'name username avatar'
    )

    if (!story) {
        res.status(404)
        throw new Error('Story not found')
    }

    if (story.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        res.status(404)
        throw new Error('Story not found')
    }

    res.json({
        story: parseStory(story, req.user),
    })
})

export const deleteStory = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id)

    if (!story) {
        res.status(404)
        throw new Error('Story not found')
    }

    if (story.user.toString() !== req.user._id.toString()) {
        res.status(403)
        throw new Error('Not authorized')
    }

    await story.remove()

    res.json({ message: 'Story deleted' })
})

export const react = asyncHandler(async (req, res) => {
    const { text } = req.body

    const story = await Story.findById(req.params.id)

    if (!story) {
        res.status(404)
        throw new Error('Story not found')
    }

    if (story.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        res.status(404)
        throw new Error('Story not found')
    }

    if (story.user.toString() === req.user._id.toString()) {
        res.status(400)
        throw new Error('Cannot react to your own story')
    }

    story.reactions.push({
        user: req.user._id,
        reaction: text,
    })

    await story.save()

    res.json({ story: parseStory(story, req.user) })
})
