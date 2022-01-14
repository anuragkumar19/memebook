import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
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
            default: '/images/default-avatar.png',
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

const User = mongoose.model('User', UserSchema)

export default User
