import { DefaultCrudRepository } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { BelongsToAccessor } from '@loopback/repository'
import { Doctor } from '../models'
import { DoctorRelations } from '../models'
import { Personal } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject, Getter } from '@loopback/core'
import { PersonalRepository } from './personal.repository'

export class DoctorRepository extends DefaultCrudRepository<
    Doctor,
    typeof Doctor.prototype.id,
    DoctorRelations
> {
    public readonly personal: BelongsToAccessor<
        Personal,
        typeof Doctor.prototype.id
    >

    constructor(
        @inject('datasources.pgconfig') dataSource: PgconfigDataSource,
        @repository.getter('PersonalRepository')
        protected personalRepositoryGetter: Getter<PersonalRepository>
    ) {
        super(Doctor, dataSource)
        this.personal = this.createBelongsToAccessorFor(
            'personal',
            personalRepositoryGetter
        )
        this.registerInclusionResolver(
            'personal',
            this.personal.inclusionResolver
        )
    }
}
