import { sentenceCase } from 'sentence-case'

export const notFound = (_req, res) => {
    res.status(404).json({ message: 'Not Found' })
}

export const errorHandler = (err, _req, res, _next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode

    if (err.statusCode) {
        statusCode = err.statusCode
    }

    statusCode === 500 && console.log(err)

    res.status(statusCode).json({
        message:
            statusCode === 500 ? 'Server Error!' : sentenceCase(err.message),
    })
}
