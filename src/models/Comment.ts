import mongoose from 'mongoose'
import {
    CommentDocument,
    CommentModel,
    CommentSchema,
} from '../interfaces/mongoose.gen'

const CommentSchema: CommentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
)

const Comment: CommentModel = mongoose.model<CommentDocument, CommentModel>(
    'Comment',
    CommentSchema
)

export default Comment
