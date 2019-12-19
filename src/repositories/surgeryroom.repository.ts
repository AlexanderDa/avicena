import { DefaultCrudRepository } from '@loopback/repository'
import { Surgeryroom, SurgeryroomRelations } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class SurgeryroomRepository extends DefaultCrudRepository<
    Surgeryroom,
    typeof Surgeryroom.prototype.id,
    SurgeryroomRelations
> {
    constructor(
        @inject('datasources.pgconfig') dataSource: PgconfigDataSource
    ) {
        super(Surgeryroom, dataSource)
    }
}
