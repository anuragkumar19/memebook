import mongoose from 'mongoose'

export const validateParamsId = (params) => (req, res, next) => {
    const id = req.params[params]

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404)
        throw new Error('Not found')
    }

    next()
}
