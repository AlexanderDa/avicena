import { DefaultCrudRepository } from '@loopback/repository'
import { Honorary } from '../models'
import { HonoraryRelations } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class HonoraryRepository extends DefaultCrudRepository<
    Honorary,
    typeof Honorary.prototype.id,
    HonoraryRelations
> {
    constructor(
        @inject('datasources.pgconfig') dataSource: PgconfigDataSource
    ) {
        super(Honorary, dataSource)
    }
}
