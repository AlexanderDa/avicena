import { resolve } from 'path'
import { existsSync } from 'fs'
import { readFileSync } from 'fs'
import { environment } from '../scripts/env'

export function init() {
    const CONFIGPATH = resolve(__dirname, '../../app.config.json')
    let config: environment = {}
    if (existsSync(CONFIGPATH)) {
        try {
            config = JSON.parse(readFileSync(CONFIGPATH).toString())
        } catch (error) {
            console.error(error)
        }
    } else {
        console.error(
            `\x1b[31m${CONFIGPATH} doesn't exist, try npm run config:app\x1b[0m`
        )
    }

    // Application URL
    process.env.BASE_URL = config.domain

    // Postgresql URL
    process.env.DBPG_BASE_URL = config.db

    // Token credentials
    process.env.TOKEN_SECRET = config.jwtKey
    process.env.TOKEN_EXPIRES = String(config.jwtExpires)

    // Upload path
    process.env.LOADING_ROUTE = config.loading
}
