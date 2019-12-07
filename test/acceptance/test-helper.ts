import { Main } from '../../src'
import { createRestAppClient } from '@loopback/testlab'
import { givenHttpServerConfig } from '@loopback/testlab'
import { Client } from '@loopback/testlab'
import '../../../environment.js'

export async function setupApplication(): Promise<AppWithClient> {
    const restConfig = givenHttpServerConfig({
        // Customize the server configuration here.
        // Empty values (undefined, '') will be ignored by the helper.
        //
        // host: process.env.HOST,
        // port: +process.env.PORT,
    })

    const app = new Main({
        rest: restConfig
    })

    await app.boot()
    await app.start()

    const client = createRestAppClient(app)

    return { app, client }
}

export interface AppWithClient {
    app: Main
    client: Client
}
