import ejs from 'ejs'
import { createTransport } from 'nodemailer'
import path from 'path'
import { __prod__ } from '../constants.js'

async function getTransporter() {
    let options = {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    }

    return createTransport(options)
}

export const sendOtp = async (email, otp) => {
    const transporter = await getTransporter()

    const html = await ejs.renderFile(
        path.join(path.resolve(), 'views', 'emails', 'otp.ejs'),
        { otp }
    )

    await transporter.sendMail({
        to: email,
        from: process.env.EMAIL,
        subject: 'Memebook - OTP',
        html,
    })
}
