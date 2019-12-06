import { DefaultCrudRepository } from '@loopback/repository'
import { Role, RoleRelations } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class RoleRepository extends DefaultCrudRepository<
    Role,
    typeof Role.prototype.id,
    RoleRelations
> {
    constructor(
        @inject('datasources.pgconfig') dataSource: PgconfigDataSource
    ) {
        super(Role, dataSource)
    }
}
