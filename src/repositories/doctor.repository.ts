import {
 DefaultCrudRepository,
 repository,
 BelongsToAccessor
} from '@loopback/repository'
import { Doctor, DoctorRelations, Professional } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject, Getter } from '@loopback/core'
import { ProfessionalRepository } from './professional.repository'

export class DoctorRepository extends DefaultCrudRepository<
 Doctor,
 typeof Doctor.prototype.id,
 DoctorRelations
> {
 public readonly professional: BelongsToAccessor<
  Professional,
  typeof Doctor.prototype.id
 >

 constructor(
  @inject('datasources.pgconfig') dataSource: PgconfigDataSource,
  @repository.getter('ProfessionalRepository')
  protected professionalRepositoryGetter: Getter<ProfessionalRepository>
 ) {
  super(Doctor, dataSource)
  this.professional = this.createBelongsToAccessorFor(
   'professional',
   professionalRepositoryGetter
  )
  this.registerInclusionResolver(
   'professional',
   this.professional.inclusionResolver
  )
 }
}
