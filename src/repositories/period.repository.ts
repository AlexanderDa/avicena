import { DefaultCrudRepository } from '@loopback/repository'
import { Period, PeriodRelations } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class PeriodRepository extends DefaultCrudRepository<
 Period,
 typeof Period.prototype.id,
 PeriodRelations
> {
 constructor(@inject('datasources.pgconfig') dataSource: PgconfigDataSource) {
  super(Period, dataSource)
 }
}
