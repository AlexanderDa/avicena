import * as dotenv from 'dotenv'
dotenv.config()
import { prompt as Prompt } from 'inquirer'
import { QuestionCollection } from 'inquirer'
import { createCF } from './env'
import { migrate } from './migrate'

class Script {
    async init(): Promise<void> {
        // eslint-disable-next-line
        let exit: boolean = false
        do {
            this.clear()
            exit = await this.menu()
        } while (!exit)
    }

    private async menu(): Promise<boolean> {
        // eslint-disable-next-line
        let exit: boolean = false
        const questions: QuestionCollection = {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: [
                { value: 'createCF', name: 'Create config file' },
                { value: 'migrate', name: 'Migrate the database' },
                { value: 'exit', name: 'Exit' }
            ]
        }
        const prompt = await Prompt(questions)
        switch (prompt.option) {
            case 'createCF':
                await createCF()
                break
            case 'migrate':
                await this.migrate()
                break
            case 'exit':
                exit = true
                break
        }
        return exit
    }

    private async migrate(): Promise<void> {
        const questions: QuestionCollection = {
            type: 'confirm',
            name: 'rebuild',
            default: false,
            message: 'rebuild database?'
        }
        const confirm = await Prompt(questions)

        await migrate(confirm.rebuild ? ['--rebuild'] : []).catch(err => {
            console.error('Cannot migrate database schema', err)
            process.exit(1)
        })
    }

    private clear(): void {
        const readline = require('readline')
        // eslint-disable-next-line
        // @ts-ignore
        const blank = '\n'.repeat(process.stdout.rows)
        console.log(blank)
        readline.cursorTo(process.stdout, 0, 0)
        readline.clearScreenDown(process.stdout)
    }
}

// eslint-disable-next-line
new Script().init()
