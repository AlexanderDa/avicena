// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-express-composition
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { ApplicationConfig } from '@loopback/core'
import { Main } from './application'
import * as history from 'connect-history-api-fallback'
import * as express from 'express'
import * as http from 'http'
import * as pEvent from 'p-event'
import * as path from 'path'

export class ExpressServer {
    private app: express.Application
    public readonly lbApp: Main
    private server?: http.Server

    constructor(options: ApplicationConfig = {}) {
        this.app = express()
        this.lbApp = new Main(options)

        // serve the cliente
        const staticFileMiddleware = express.static(
            path.resolve('./public/client')
        )
        switch (process.env.NODE_ENV) {
            case 'development':
                // in development mode show openapi
                this.app.use('/', this.lbApp.requestHandler)
                this.app.use(staticFileMiddleware)
                break
            case 'production':
                // in development mode use staticFileMiddleware
                this.app.use(staticFileMiddleware)
                this.app.use(history())
                this.app.use(staticFileMiddleware)
                this.app.use('/', this.lbApp.requestHandler)
                break

            default:
                console.error(
                    `\x1b[31mNODE_ENV must be in "development" or "production" mode, please check in ${path.resolve(
                        './.env'
                    )}\x1b[0m`
                )
                process.exit(0)
                break
        }
    }

    public async boot() {
        await this.lbApp.boot()
    }

    public async start() {
        await this.lbApp.start()
        const port = this.lbApp.restServer.config.port
        const host = this.lbApp.restServer.config.host

        // Don't use host in development mode
        if (process.env.NODE_ENV === 'production' && host)
            this.server = this.app.listen(port, host)
        else this.server = this.app.listen(port)

        await pEvent(this.server, 'listening')
        console.log(`App running at:`)
        console.log(`- Mode:    \x1b[36m${process.env.NODE_ENV}\x1b[0m`)
        console.log(`- Network: \x1b[36mhttp://${host || '127.0.0.1'}:${port}/\x1b[0m`)
        if (process.env.NODE_ENV === 'development')
            console.log(`- Apis:    \x1b[36mhttp://${host || '127.0.0.1'}:${port}/api/explorer/\x1b[0m`)
    }

    // For testing purposes
    public async stop() {
        if (!this.server) return
        await this.lbApp.stop()
        this.server.close()
        await pEvent(this.server, 'close')
        this.server = undefined
    }
}
