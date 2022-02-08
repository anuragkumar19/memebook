import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import 'dotenv/config'
import http from 'http'
import morgan from 'morgan'
import webPush from 'web-push'
import router from './routes/index.js'
import { Server } from 'socket.io'
import { __prod__ } from './constants.js'
import { connectDB } from './config/db.js'
import { errorHandler, notFound } from './middlewares/errors.js'
import { socketMiddleware } from './middlewares/auth.js'
import { socketHandler } from './controllers/socket.js'

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: '*',
})

// Socket middleware
io.use(socketMiddleware)

// Socket handler
io.on('connection', socketHandler)

// Connect to database
connectDB()

// Set WebPush config
webPush.setVapidDetails(
    `mailto:${process.env.EMAIL}`,
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
)

app.use(express.json())
app.use(cors())

// Logging
!__prod__ && app.use(morgan('dev'))

// Routes
app.use('/api/v1', router)

// 404 error
app.use(notFound)

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(
        chalk.cyan.bold.underline(
            `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
        )
    )
})
