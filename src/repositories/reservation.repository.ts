import { DefaultCrudRepository } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { BelongsToAccessor } from '@loopback/repository'
import { Reservation } from '../models'
import { ReservationRelations } from '../models'
import { Doctor } from '../models'
import { Honorary } from '../models'
import { Period } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject } from '@loopback/core'
import { Getter } from '@loopback/core'
import { DoctorRepository } from './doctor.repository'
import { HonoraryRepository } from './honorary.repository'
import { PeriodRepository } from './period.repository'

export class ReservationRepository extends DefaultCrudRepository<
    Reservation,
    typeof Reservation.prototype.id,
    ReservationRelations
> {
    public readonly doctor: BelongsToAccessor<
        Doctor,
        typeof Reservation.prototype.id
    >

    public readonly honorary: BelongsToAccessor<
        Honorary,
        typeof Reservation.prototype.id
    >

    public readonly period: BelongsToAccessor<
        Period,
        typeof Reservation.prototype.id
    >

    constructor(
        @inject('datasources.pgconfig') dataSource: PgconfigDataSource,
        @repository.getter('DoctorRepository')
        protected doctorRepositoryGetter: Getter<DoctorRepository>,
        @repository.getter('HonoraryRepository')
        protected honoraryRepositoryGetter: Getter<HonoraryRepository>,
        @repository.getter('PeriodRepository')
        protected periodRepositoryGetter: Getter<PeriodRepository>
    ) {
        super(Reservation, dataSource)
        this.period = this.createBelongsToAccessorFor(
            'period',
            periodRepositoryGetter
        )
        this.registerInclusionResolver('period', this.period.inclusionResolver)
        this.honorary = this.createBelongsToAccessorFor(
            'honorary',
            honoraryRepositoryGetter
        )
        this.registerInclusionResolver(
            'honorary',
            this.honorary.inclusionResolver
        )
        this.doctor = this.createBelongsToAccessorFor(
            'doctor',
            doctorRepositoryGetter
        )
        this.registerInclusionResolver('doctor', this.doctor.inclusionResolver)
    }
}
