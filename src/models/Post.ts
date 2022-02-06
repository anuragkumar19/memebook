import mongoose from 'mongoose'
import { PostDocument, PostModel, PostSchema } from '../interfaces/mongoose.gen'

const PostSchema: PostSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        caption: {
            type: String,
        },
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            required: true,
        },
        media: {
            type: [String],
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    { timestamps: true }
)

const Post: PostModel = mongoose.model<PostDocument, PostModel>(
    'Post',
    PostSchema
)

export default Post
