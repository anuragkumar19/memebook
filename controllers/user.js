import asyncHandler from 'express-async-handler'
import Post from '../models/Post.js'
import User from '../models/User.js'
import { parsePost, parseUser } from '../utils/parser.js'

export const getLoggedInUser = asyncHandler(async (req, res) => {
    const user = req.user

    user.password = undefined
    user.otp = undefined
    user.otpExpiry = undefined

    res.status(200).json({
        user,
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

    res.status(200).json({
        user: parseUser(user),
    })
})

export const getPostOfUser = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username })

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    const posts = await Post.find({
        user: user._id,
    }).populate('user', 'name username avatar')

    const sendablePosts = posts.map((post) => parsePost(post))

    res.status(200).json({
        posts: sendablePosts,
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

    res.status(200).json({
        following: user.following,
    })
})

export const follow = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({ username })

    if (!user) {
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

    await user.save()

    res.status(200).json({
        message: 'Unfollowed successfully',
    })
})

export const searchUser = asyncHandler(async (req, res) => {
    const { q } = req.query

    if (!q) {
        res.status(400)
        throw new Error('Query is required')
    }

    const users = await User.find({
        $or: [
            { username: { $regex: q, $options: 'i' } },
            { name: { $regex: q, $options: 'i' } },
        ],
    })
        .select('name username avatar')
        .limit(10)

    res.status(200).json({
        users,
    })
})
