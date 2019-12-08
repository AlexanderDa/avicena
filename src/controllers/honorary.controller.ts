import { inject } from '@loopback/context'
import { Count } from '@loopback/repository'
import { Filter } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { Where } from '@loopback/repository'
import { post, HttpErrors } from '@loopback/rest'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'
import { getFilterSchemaFor } from '@loopback/rest'
import { getWhereSchemaFor } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { put } from '@loopback/rest'
import { del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { UserProfile } from '@loopback/security'
import { Honorary } from '../models'
import { HonoraryRepository } from '../repositories'
import { HonorarySpect } from './specs/honorary.spect'
import { AccountBindings } from '../keys'
import { AuditBindings } from '../keys'
import { AccountService } from '../services/account.service'
import { AuditService, AuditTable } from '../services/audit.service'

export class HonoraryController {
    constructor(
        @repository(HonoraryRepository)
        public honoraryRepository: HonoraryRepository,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/honorary', new HonorarySpect().created())
    @authenticate('jwt')
    async create(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new HonorarySpect().create())
        honorary: Omit<Honorary, 'id'>
    ): Promise<Honorary> {
        return this.honoraryRepository.create(honorary)
    }

    @get('/api/honoraries/count', new HonorarySpect().count())
    @authenticate('jwt')
    async count(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('where', getWhereSchemaFor(Honorary))
        where?: Where<Honorary>
    ): Promise<Count> {
        return this.honoraryRepository.count(where)
    }

    @get('/api/honoraries', new HonorarySpect().found())
    @authenticate('jwt')
    async find(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('filter', getFilterSchemaFor(Honorary))
        filter?: Filter<Honorary>
    ): Promise<Honorary[]> {
        return this.honoraryRepository.find(filter)
    }

    @patch(
        '/api/honoraries',
        new HonorarySpect().count('Honorary PATCH success count')
    )
    @authenticate('jwt')
    async updateAll(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new HonorarySpect().partial())
        honorary: Honorary,
        @param.query.object('where', getWhereSchemaFor(Honorary))
        where?: Where<Honorary>
    ): Promise<Count> {
        return this.honoraryRepository.updateAll(honorary, where)
    }

    @get('/api/honorary/{id}', new HonorarySpect().created())
    @authenticate('jwt')
    async findById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<Honorary> {
        return this.honoraryRepository.findById(id)
    }

    @patch(
        '/api/honorary/{id}',
        new HonorarySpect().simple('Honorary PATCH success')
    )
    @authenticate('jwt')
    async updateById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new HonorarySpect().update())
        honorary: Honorary
    ): Promise<void> {
        console.log(honorary)
        await this.honoraryRepository.updateById(id, honorary)
    }

    @put(
        '/api/honorary/{id}',
        new HonorarySpect().simple('Honorary PUT success')
    )
    @authenticate('jwt')
    async replaceById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new HonorarySpect().update()) honorary: Honorary
    ): Promise<void> {
        await this.honoraryRepository.replaceById(id, honorary)
    }

    @del('/api/honorary/{id}', new HonorarySpect().simple())
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.honoraryRepository.deleteById(id)
            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.HONORARY,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
