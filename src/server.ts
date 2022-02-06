import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import 'dotenv/config'
import morgan from 'morgan'
import router from './routes/index'
import { __prod__ } from './constants'
import { connectDB } from './config/db'
import { errorHandler, notFound } from './middlewares/errors'

const app = express()

// Connect to database
connectDB()

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

app.listen(PORT, () => {
    console.log(
        chalk.cyan.bold.underline(
            `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
        )
    )
})
