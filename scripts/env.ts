import { url as pgUrl } from '../src/datasources/pgconfig.datasource.config.json'
import { resolve } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { writeFileSync } from 'fs'
import { prompt as Prompt } from 'inquirer'
import { QuestionCollection } from 'inquirer'
const CONFIGPATH: string = resolve('./.env')

export async function createCF(): Promise<void> {
    await Prompt([
        {
            name: 'env',
            message: 'Environment',
            default: process.env.NODE_ENV || 'development'
        },
        {
            name: 'host',
            message: 'Host',
            default: process.env.HOST || '127.0.0.1'
        },
        {
            name: 'port',
            message: 'Port',
            default: process.env.PORT || 3000
        },
        {
            name: 'domain',
            message: 'Domain',
            default: process.env.BASE_URL || 'http://127.0.0.1:3000'
        },
        {
            name: 'db',
            message: 'Database ',
            default: process.env.DBPG_BASE_URL || pgUrl
        },
        {
            name: 'loading',
            message: 'Loadin path ',
            default: process.env.LOADING_ROUTE || resolve('./uploads')
        },
        {
            name: 'jwtExpires',
            message: 'Session expires in ',
            default: process.env.TOKEN_EXPIRES || 3600
        },
        {
            name: 'jwtKey',
            message: 'Session secret key ',
            type: 'password',
            default: process.env.TOKEN_SECRET || 'myjwts3cr3t'
        },
        {
            name: 'emailHost',
            message: 'Email host',
            default: process.env.EMAIL_HOST || 'smtp.office365.com'
        },
        {
            name: 'emailAddress',
            message: 'Email account',
            default: process.env.EMAIL_ADDRESS || 'example@example.com'
        },
        {
            name: 'emailPassword',
            message: 'Email password',
            type: 'password',
            default: process.env.EMAIL_PASSWORD || 'myemails3cr3t'
        }
    ])
        .then(async result => {
            const env = `
# Server information
NODE_ENV = ${result.env}
HOST = ${result.host}
PORT = ${result.port}
BASE_URL = ${result.domain}

# Postgresql URL
DBPG_BASE_URL = ${result.db}

# Token credentials
TOKEN_SECRET = ${result.jwtKey}
TOKEN_EXPIRES = ${result.jwtExpires}

# Upload path
LOADING_ROUTE = ${result.loading}

# Email credentials
EMAIL_HOST = ${result.emailHost}
EMAIL_ADDRESS = ${result.emailAddress}
EMAIL_PASSWORD = ${result.emailPassword}
`
            process.env.NODE_ENV = result.env
            process.env.HOST = result.host
            process.env.PORT = result.port
            process.env.BASE_URL = result.domain
            process.env.DBPG_BASE_URL = result.db
            process.env.TOKEN_SECRET = result.jwtKey
            process.env.TOKEN_EXPIRES = result.jwtExpires
            process.env.LOADING_ROUTE = result.loading
            process.env.EMAIL_HOST = result.emailHost
            process.env.EMAIL_ADDRESS = result.emailAddress
            process.env.EMAIL_PASSWORD = result.emailPassword

            writeFileSync(CONFIGPATH, env)
            if (!existsSync(result.loading)) {
                const IMGPATH = resolve(result.loading, 'images')
                const questions: QuestionCollection = {
                    type: 'confirm',
                    name: 'images',
                    default: true,
                    message: 'create image folder?'
                }
                const confirm = await Prompt(questions)

                if (confirm.images) {
                    mkdirSync(IMGPATH, { recursive: true })
                }
            }
        })
        .catch(() => {})
}
