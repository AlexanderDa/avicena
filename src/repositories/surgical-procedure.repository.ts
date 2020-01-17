import { DefaultCrudRepository } from '@loopback/repository'
import { SurgicalProcedure, SurgicalProcedureRelations } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class SurgicalProcedureRepository extends DefaultCrudRepository<
    SurgicalProcedure,
    typeof SurgicalProcedure.prototype.id,
    SurgicalProcedureRelations
> {
    constructor(
        @inject('datasources.pgconfig') dataSource: PgconfigDataSource
    ) {
        super(SurgicalProcedure, dataSource)
    }
}
