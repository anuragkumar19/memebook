import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserDocument, UserModel, UserSchema } from '../interfaces/mongoose.gen'

const UserSchema: UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: process.env.DEFAULT_AVATAR,
        },
        bio: {
            type: String,
            default: '',
        },
        website: {
            type: String,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        otp: {
            type: Number,
        },
        otpExpiry: {
            type: Number,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        savedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    { timestamps: true }
)

// Password hash middleware
UserSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password')) return next()

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password, salt)
    user.password = hash
    next()
})

UserSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compareSync(candidatePassword, this.password)
}

UserSchema.methods.generateAuthToken = function () {
    const user = this
    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN_SECRET
    )
    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
    ) // 10 minutes

    return { refreshToken, accessToken }
}

UserSchema.methods.generateAccessToken = function () {
    const user = this
    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10m' }
    ) // 10 minutes

    return accessToken
}

const User: UserModel = mongoose.model<UserDocument, UserModel>(
    'User',
    UserSchema
)

export default User
