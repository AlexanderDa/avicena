import { inject } from '@loopback/core'
import { lifeCycleObserver } from '@loopback/core'
import { LifeCycleObserver } from '@loopback/core'
import { ValueOrPromise } from '@loopback/core'
import { juggler } from '@loopback/repository'
import { name as DBPG_NAME } from './pgconfig.datasource.config.json'
import { connector as DBPG_CONNECTOR } from './pgconfig.datasource.config.json'

const pgConfig: object = {
    name: DBPG_NAME,
    connector: DBPG_CONNECTOR,
    url: process.env.DBPG_BASE_URL
}

@lifeCycleObserver('datasource')
export class PgconfigDataSource extends juggler.DataSource
    implements LifeCycleObserver {
    static dataSourceName = 'pgconfig'

    constructor(
        @inject('datasources.config.pgconfig', { optional: true })
        dsConfig: object = pgConfig
    ) {
        super(dsConfig)
    }

    /**
     * Start the datasource when application is started
     */
    start(): ValueOrPromise<void> {
        // Add your logic here to be invoked when the application is started
    }

    /**
     * Disconnect the datasource when application is stopped. This allows the
     * application to be shut down gracefully.
     */
    stop(): ValueOrPromise<void> {
        return super.disconnect()
    }
}
