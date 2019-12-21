import { resolve } from 'path'
import { existsSync } from 'fs'
import { readFileSync } from 'fs'
import { AppConfig } from '../scripts/env'

export function init() {
    const CONFIGPATH = resolve(__dirname, '../../app.config.json')
    //    let config: AppConfig = {}
    if (existsSync(CONFIGPATH)) {
        try {
            const config: AppConfig = JSON.parse(
                readFileSync(CONFIGPATH).toString()
            )

            // Application URL
            process.env.BASE_URL = config.domain

            // Postgresql URL
            process.env.DBPG_BASE_URL = config.db

            // Token credentials
            process.env.TOKEN_SECRET = config.jwt.key
            process.env.TOKEN_EXPIRES = String(config.jwt.expires)

            // Upload path
            process.env.LOADING_ROUTE = config.loading

            // Email credentials
            process.env.EMAIL_HOST = config.email.host
            process.env.EMAIL_ADDRESS = config.email.account
            process.env.EMAIL_PASSWORD = config.email.password
        } catch (error) {
            console.error(error)
        }
    } else {
        console.error(
            `\x1b[31m${CONFIGPATH} doesn't exist, try npm run cli\x1b[0m`
        )
    }
}
