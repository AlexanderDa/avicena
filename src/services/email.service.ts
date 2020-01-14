import * as nodemailer from 'nodemailer'
import { resolve } from 'path'
import { renderFile } from 'ejs'
import { appInfo } from '../../common/AppInfo'

export interface EmailService {
    welcome(
        name: string,
        email: string,
        confirmationCode: string
    ): Promise<void>
}

export class MyEmailService implements EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    async welcome(
        name: string,
        email: string,
        confirmationCode: string
    ): Promise<void> {
        const mailOptions = {
            from: `${appInfo.name} <${process.env.EMAIL_ADDRESS}>`,
            to: email,
            subject: 'Bienvenido',
            html: await renderFile(
                resolve(__dirname, '../../../public/email/welcome.ejs'),
                {
                    appUrl: process.env.BASE_URL,
                    name: name,
                    query: JSON.stringify({
                        userName: name,
                        activationCode: confirmationCode,
                        emailAddress: email
                    })
                }
            )
        }

        await this.transporter
            .sendMail(mailOptions)
            .then(() => {
                console.log(`Email sent to: \x1b[36m${email}\x1b[0m`)
            })
            .catch(err => {
                console.log(
                    `Error sending email to: \x1b[36m${email}\x1b[0m`,
                    err
                )
            })
    }
}
