import { url as pgUrl } from '../src/datasources/pgconfig.datasource.config.json'
import { resolve } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { writeFileSync } from 'fs'
import { readFileSync } from 'fs'
import { prompt as Prompt } from 'inquirer'
import { QuestionCollection } from 'inquirer'
const CONFIGPATH: string = resolve(__dirname, '../../app.config.json')

// eslint-disable-next-line
export interface environment {
    domain?: string
    db?: string
    loading?: string
    jwtExpires?: number
    jwtKey?: string
}

export async function getConfig(): Promise<environment> {
    let config: environment = {}
    if (existsSync(CONFIGPATH)) {
        try {
            config = JSON.parse(readFileSync(CONFIGPATH).toString())
        } catch (error) {
            console.error()
        }
    }
    return config
}

export async function createEF(): Promise<void> {
    const config: environment = await getConfig()
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
        }
    ])
        .then(async result => {
            writeFileSync(CONFIGPATH, JSON.stringify(result, null, '\t'))
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
