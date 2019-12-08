import { inject } from '@loopback/context'
import { Count } from '@loopback/repository'
import { Filter } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { Where } from '@loopback/repository'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'
import { getFilterSchemaFor } from '@loopback/rest'
import { getWhereSchemaFor } from '@loopback/rest'
import { Role } from '../models'
import { RoleRepository } from '../repositories'
import { authenticate } from '@loopback/authentication'
import { RoleSpect } from './specs/role.spect'

export class RoleController {
    constructor(
        @repository(RoleRepository) public roleRepository: RoleRepository
    ) {}

    @get('/api/roles/count', new RoleSpect().count())
    @authenticate('jwt')
    async count(
        @param.query.object('where', getWhereSchemaFor(Role))
        where?: Where<Role>
    ): Promise<Count> {
        return this.roleRepository.count(where)
    }

    @get('/api/roles', new RoleSpect().found())
    @authenticate('jwt')
    async find(
        @param.query.object('filter', getFilterSchemaFor(Role))
        filter?: Filter<Role>
    ): Promise<Role[]> {
        return this.roleRepository.find(filter)
    }

    @get('/api/role/{id}', new RoleSpect().created())
    @authenticate('jwt')
    async findById(@param.path.number('id') id: number): Promise<Role> {
        return this.roleRepository.findById(id)
    }
}
