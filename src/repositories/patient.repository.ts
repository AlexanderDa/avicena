import { DefaultCrudRepository } from '@loopback/repository'
import { Patient } from '../models'
import { PatientRelations } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class PatientRepository extends DefaultCrudRepository<
    Patient,
    typeof Patient.prototype.id,
    PatientRelations
> {
    constructor(
        @inject('datasources.pgconfig') dataSource: PgconfigDataSource
    ) {
        super(Patient, dataSource)
    }
}
