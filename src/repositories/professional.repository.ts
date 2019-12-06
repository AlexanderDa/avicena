import {
 DefaultCrudRepository,
 repository,
 BelongsToAccessor
} from '@loopback/repository'
import { Professional, ProfessionalRelations, User } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject, Getter } from '@loopback/core'
import { UserRepository } from './user.repository'

export class ProfessionalRepository extends DefaultCrudRepository<
 Professional,
 typeof Professional.prototype.id,
 ProfessionalRelations
> {
 public readonly user: BelongsToAccessor<User, typeof Professional.prototype.id>

 constructor(
  @inject('datasources.pgconfig') dataSource: PgconfigDataSource,
  @repository.getter('UserRepository')
  protected userRepositoryGetter: Getter<UserRepository>
 ) {
  super(Professional, dataSource)
  this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter)
  this.registerInclusionResolver('user', this.user.inclusionResolver)
 }
}
