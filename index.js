require('dotenv').config()
const { existsSync } = require('fs')
const application = require('./dist/src')

if (!existsSync('./.env')) {
    console.error(`\x1b[31m.env doesn't exist, try npm run cli\x1b[0m`)
    process.exit(0)
}

module.exports = application

if (require.main === module) {
    // Run the application
    const config = {
        rest: {
            port:
                process.env.NODE_ENV === 'production' ? process.env.PORT : 3000,
            host: process.env.HOST,
            openApiSpec: {
                // useful when used with OpenAPI-to-GraphQL to locate your application
                setServersFromRequest: true
            },
            // Use the LB4 application as a route. It should not be listening.
            listenOnStart: false
        }
    }
    application.main(config).catch(err => {
        console.error('Cannot start the application.', err)
        process.exit(1)
    })
}
