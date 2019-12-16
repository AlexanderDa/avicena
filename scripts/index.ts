import { prompt } from 'inquirer'
import { createEF } from './env'
import { migrate } from './migrate'

prompt({
    type: 'list',
    name: 'options',
    message: 'What would you like to do?',
    choices: [
        { value: 'createEF', name: 'Create variables file' },
        { value: 'migrate', name: 'Migrate the database' }
    ]
})
    .then(async answer => {
        const options: string[] = answer.options
        if (options.includes('createEF')) await createEF()

        if (options.includes('migrate')) {
            prompt({
                type: 'confirm',
                name: 'rebuild',
                default: false,
                message: 'rebuild database?'
            })
                .then(confirm => {
                    const migrationArgs: string[] = []
                    if (confirm.rebuild) migrationArgs.push('--rebuild')

                    migrate(migrationArgs).catch(err => {
                        console.error('Cannot migrate database schema', err)
                        process.exit(1)
                    })
                })
                .catch(() => {})
        }
    })
    .catch(() => {})
