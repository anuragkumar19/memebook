export const parseUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        website: user.website,
        followers: user.followers.length,
        following: user.following.length,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}

export const parsePost = (post) => {
    return {
        _id: post._id,
        user: post.user,
        caption: post.caption,
        mediaType: post.mediaType,
        media: post.media,
        likes: post.likes.length,
        comments: post.comments.length,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    }
}

export const parseComment = (comment) => {
    return {
        _id: comment._id,
        user: comment.user,
        post: comment.post,
        text: comment.text,
        likes: comment.likes.length,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
    }
}
