import { DefaultCrudRepository } from '@loopback/repository'
import { Audit, AuditRelations } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class AuditRepository extends DefaultCrudRepository<
    Audit,
    typeof Audit.prototype.id,
    AuditRelations
> {
    constructor(
        @inject('datasources.pgconfig') dataSource: PgconfigDataSource
    ) {
        super(Audit, dataSource)
    }
}
