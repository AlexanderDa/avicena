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
import { Professional } from '../models'
import { ProfessionalRepository } from '../repositories'
import { ProfessionalSpect } from './specs/professional.spect'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings, UserProfile } from '@loopback/security'
import { AuditTable, AuditService } from '../services/audit.service'
import { AuditBindings, AccountBindings } from '../keys'
import { AccountService } from '../services/account.service'

export class ProfessionalController {
    constructor(
        @repository(ProfessionalRepository)
        public professionalRepository: ProfessionalRepository,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/professional', new ProfessionalSpect().created())
    async create(
        @requestBody(new ProfessionalSpect().create())
        professional: Omit<Professional, 'id'>
    ): Promise<Professional> {
        return this.professionalRepository.create(professional)
    }

    @get('/api/professionals/count', new ProfessionalSpect().count())
    async count(
        @param.query.object('where', getWhereSchemaFor(Professional))
        where?: Where<Professional>
    ): Promise<Count> {
        return this.professionalRepository.count(where)
    }

    @get('/api/professionals', new ProfessionalSpect().found())
    async find(
        @param.query.object('filter', getFilterSchemaFor(Professional))
        filter?: Filter<Professional>
    ): Promise<Professional[]> {
        return this.professionalRepository.find(filter)
    }

    @patch('/api/professional', new ProfessionalSpect().count())
    async updateAll(
        @requestBody(new ProfessionalSpect().partial())
        professional: Professional,
        @param.query.object('where', getWhereSchemaFor(Professional))
        where?: Where<Professional>
    ): Promise<Count> {
        return this.professionalRepository.updateAll(professional, where)
    }

    @get('/api/professional/{id}', new ProfessionalSpect().created())
    async findById(
        @param.path.number('id') id: number,
        @param.query.object('filter', getFilterSchemaFor(Professional))
        filter?: Filter<Professional>
    ): Promise<Professional> {
        return this.professionalRepository.findById(id, filter)
    }

    @get('/api/professional/user/{id}', new ProfessionalSpect().created())
    async findByUser(
        @param.path.number('id') id: number
    ): Promise<Professional> {
        const result = await this.professionalRepository.findOne({
            where: { userId: id }
        })

        return new Professional(result || undefined)
    }

    @patch(
        '/api/professional/{id}',
        new ProfessionalSpect().simple('Professional PATCH success')
    )
    async updateById(
        @param.path.number('id') id: number,
        @requestBody(new ProfessionalSpect().partial())
        professional: Professional
    ): Promise<void> {
        await this.professionalRepository.updateById(id, professional)
    }

    @put(
        '/api/professional/{id}',
        new ProfessionalSpect().simple('Professional PUT success')
    )
    async replaceById(
        @param.path.number('id') id: number,
        @requestBody() professional: Professional
    ): Promise<void> {
        await this.professionalRepository.replaceById(id, professional)
    }

    @del(
        '/api/professional/{id}',
        new ProfessionalSpect().simple('Professional DELETE success')
    )
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.professionalRepository.deleteById(id)
            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.PROFESSIONAL,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
