import { DefaultCrudRepository } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { BelongsToAccessor } from '@loopback/repository'
import { Personal } from '../models'
import { PersonalRelations } from '../models'
import { User } from '../models'
import { PgconfigDataSource } from '../datasources'
import { inject, Getter } from '@loopback/core'
import { UserRepository } from './user.repository'

export class PersonalRepository extends DefaultCrudRepository<
    Personal,
    typeof Personal.prototype.id,
    PersonalRelations
> {
    public readonly user: BelongsToAccessor<User, typeof Personal.prototype.id>

    constructor(
        @inject('datasources.pgconfig') dataSource: PgconfigDataSource,
        @repository.getter('UserRepository')
        protected userRepositoryGetter: Getter<UserRepository>
    ) {
        super(Personal, dataSource)
        this.user = this.createBelongsToAccessorFor(
            'user',
            userRepositoryGetter
        )
        this.registerInclusionResolver('user', this.user.inclusionResolver)
    }
}
