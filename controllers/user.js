import asyncHandler from 'express-async-handler'
import Notification from '../models/Notification.js'
import Post from '../models/Post.js'
import Story from '../models/Story.js'
import User from '../models/User.js'
import { parsePost, parseStory, parseUser } from '../utils/parser.js'

export const getLoggedInUser = asyncHandler(async (req, res) => {
    const user = req.user

    res.status(200).json({
        user: {
            ...parseUser(user),
            postsCount: await Post.countDocuments({ user: user._id }),
            email: user.email,
        },
    })
})

export const updateBio = asyncHandler(async (req, res) => {
    const { bio } = req.body

    const user = req.user

    user.bio = bio

    await user.save()

    res.status(200).json({
        message: 'Bio updated successfully',
    })
})

export const updateWebsite = asyncHandler(async (req, res) => {
    const { website } = req.body

    const user = req.user

    user.website = website

    await user.save()

    res.status(200).json({
        message: 'Website updated successfully',
    })
})

export const updateName = asyncHandler(async (req, res) => {
    const { name } = req.body

    const user = req.user

    user.name = name

    await user.save()

    res.status(200).json({
        message: 'Name updated successfully',
    })
})

export const updateUsername = asyncHandler(async (req, res) => {
    const { username } = req.body

    const user = req.user

    const checkUser = await User.findOne({ username })

    if (checkUser) {
        res.status(400)
        throw new Error('Username already exists')
    }

    user.username = username

    await user.save()

    res.status(200).json({
        message: 'Username updated successfully',
    })
})

export const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = req.user

    if (!user.comparePassword(oldPassword)) {
        res.status(400)
        throw new Error('Incorrect old password')
    }

    user.password = newPassword

    await user.save()

    res.status(200).json({
        message: 'Password updated successfully',
    })
})

export const updateAvatar = asyncHandler(async (req, res) => {
    const user = req.user

    user.avatar = req.file.path

    await user.save()

    res.status(200).json({
        message: 'Avatar updated successfully',
        avatar: user.avatar,
    })
})

export const getUserByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username })

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    if (!user.isEmailVerified) {
        res.status(404)
        throw new Error('User not found')
    }

    res.status(200).json({
        user: {
            ...parseUser(user),
            postsCount: await Post.countDocuments({ user: user._id }),
            isFollowing: req.user.following.includes(user._id),
            isFollower: req.user.followers.includes(user._id),
        },
    })
})

export const getPostOfUser = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username })

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    if (!user.isEmailVerified) {
        res.status(404)
        throw new Error('User not found')
    }

    let { page, limit } = req.query

    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 10
    }

    const posts = await Post.find({
        user: user._id,
    })
        .populate('user', 'name username avatar')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort('-createdAt')

    res.status(200).json({
        posts: posts.map((post) => parsePost(post, req.user)),
    })
})

export const getStoryOfUser = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username })

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    if (!user.isEmailVerified) {
        res.status(404)
        throw new Error('User not found')
    }

    const stories = await Story.find({
        user: user._id,
        // Less than 24 hours
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })

    res.status(200).json({
        stories: stories.map((story) => parseStory(story, req.user)),
    })
})

export const getFollowers = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username }).populate(
        'followers',
        'name username avatar'
    )

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    if (!user.isEmailVerified) {
        res.status(404)
        throw new Error('User not found')
    }

    res.status(200).json({
        followers: user.followers,
    })
})

export const getFollowing = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username }).populate(
        'following',
        'name username avatar'
    )

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    if (!user.isEmailVerified) {
        res.status(404)
        throw new Error('User not found')
    }

    res.status(200).json({
        following: user.following,
    })
})

export const getSavedPosts = asyncHandler(async (req, res) => {
    let { page, limit } = req.query

    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 10
    }

    const posts = await Post.find({
        _id: { $in: req.user.savedPosts },
    })
        .populate('user', 'name username avatar')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)

    res.status(200).json({
        savedPosts: posts.map((post) => parsePost(post, req.user)),
    })
})

export const follow = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username })

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    if (!user.isEmailVerified) {
        res.status(404)
        throw new Error('User not found')
    }

    const follower = req.user

    if (follower.following.includes(user._id)) {
        res.status(400)
        throw new Error('Already following')
    }

    if (follower._id.equals(user._id)) {
        res.status(400)
        throw new Error('You cannot follow yourself')
    }

    follower.following.push(user._id)

    await follower.save()

    user.followers.push(follower._id)

    await Notification.create({
        user: user._id,
        followedBy: follower._id,
        type: 'follow',
    })

    await user.save()

    res.status(200).json({
        message: 'Followed successfully',
    })
})

export const unfollow = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username })

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    if (!user.isEmailVerified) {
        res.status(404)
        throw new Error('User not found')
    }

    const follower = req.user

    if (!follower.following.includes(user._id)) {
        res.status(400)
        throw new Error('Not following')
    }

    follower.following = follower.following.filter(
        (followingId) => !followingId.equals(user._id)
    )

    await follower.save()

    user.followers = user.followers.filter(
        (followerId) => !followerId.equals(follower._id)
    )

    await Notification.findOneAndDelete({
        user: user._id,
        followedBy: follower._id,
        type: 'follow',
    })

    await user.save()

    res.status(200).json({
        message: 'Unfollowed successfully',
    })
})

export const searchUser = asyncHandler(async (req, res) => {
    let { q, page, limit } = req.query

    q = q.trim()

    if (!q) {
        res.status(400)
        throw new Error('Query is required')
    }

    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 10
    }

    const users = await User.find({
        $or: [
            { username: { $regex: q, $options: 'i' }, isEmailVerified: true },
            { name: { $regex: q, $options: 'i' }, isEmailVerified: true },
        ],
    })
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .select('name username avatar')

    res.status(200).json({
        users,
    })
})
