import { url as pgUrl } from '../src/datasources/pgconfig.datasource.config.json'
import { resolve } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { writeFileSync } from 'fs'
import { readFileSync } from 'fs'
import { prompt as Prompt } from 'inquirer'
import { QuestionCollection } from 'inquirer'
const CONFIGPATH: string = resolve(__dirname, '../../app.config.json')

export interface EmailConfig {
    host: string
    account: string
    password: string
}

export interface JwtConfig {
    key: string
    expires: number
}

export interface AppConfig {
    domain: string
    db: string
    loading: string
    jwt: JwtConfig
    email: EmailConfig
}

// eslint-disable-next-line
interface inquirerResponses {
    domain?: string
    db?: string
    loading?: string
    jwtExpires?: number
    jwtKey?: string
    emailHost?: string
    emailAddress?: string
    emailPassword?: string
}

export async function getConfig(): Promise<inquirerResponses> {
    let config: inquirerResponses = {}
    if (existsSync(CONFIGPATH)) {
        try {
            config = JSON.parse(readFileSync(CONFIGPATH).toString())
        } catch (error) {
            console.error()
        }
    }
    return config
}

export async function createCF(): Promise<void> {
    const config: inquirerResponses = await getConfig()
    await Prompt([
        {
            name: 'domain',
            message: 'Domain',
            default: config.domain ? config.domain : 'http://localhost:3000'
        },
        {
            name: 'db',
            message: 'Database ',
            default: config.db ? config.db : pgUrl
        },
        {
            name: 'loading',
            message: 'Loadin path ',
            default: config.loading
                ? config.loading
                : resolve(__dirname, '../../uploads')
        },
        {
            name: 'jwtExpires',
            message: 'Session expires in ',
            default: config.jwtExpires ? config.jwtExpires : 3600
        },
        {
            name: 'jwtKey',
            message: 'Session secret key ',
            type: 'password',
            default: config.jwtKey ? config.jwtKey : 'myjwts3cr3t'
        },
        {
            name: 'emailHost',
            message: 'Email host',
            default: config.emailHost ? config.emailHost : 'smtp.office365.com'
        },
        {
            name: 'emailAddress',
            message: 'Email account',
            default: config.emailAddress
                ? config.emailAddress
                : 'example@example.com'
        },
        {
            name: 'emailPassword',
            message: 'Email password',
            type: 'password',
            default: config.emailPassword
                ? config.emailPassword
                : 'myemails3cr3t'
        }
    ])
        .then(async result => {
            const appConfig: AppConfig = {
                domain: result.domain,
                db: result.db,
                loading: result.loading,
                jwt: {
                    expires: result.jwtExpires,
                    key: result.jwtKey
                },
                email: {
                    host: result.emailHost,
                    account: result.emailAddress,
                    password: result.emailPassword
                }
            }
            writeFileSync(CONFIGPATH, JSON.stringify(appConfig, null, '\t'))
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
