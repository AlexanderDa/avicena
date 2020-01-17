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
import { authenticate, UserService } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { UserProfile } from '@loopback/security'
import { SurgicalProcedure, User } from '../models'
import { SurgicalProcedureRepository } from '../repositories'
import { Credentials } from '../../common/Credentials'
import { UserBindings } from '../keys'
import { AccountBindings } from '../keys'
import { AuditBindings } from '../keys'
import { AccountService } from '../services/account.service'
import { AuditService, AuditTable } from '../services/audit.service'
import { SurgicalProcedureSpect } from './specs/surgicalprocedure.spect'

export class SurgicalProcedureController {
    constructor(
        @repository(SurgicalProcedureRepository) public procedureRepository: SurgicalProcedureRepository,
        @inject(UserBindings.USER_SERVICE)
        public userService: UserService<User, Credentials>,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/surgicalprocedure', new SurgicalProcedureSpect().created())
    @authenticate('jwt')
    async create(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new SurgicalProcedureSpect().create()) procedure: Omit<SurgicalProcedure, 'id'>
    ): Promise<SurgicalProcedure> {
        const me: User = await this.acountService.convertToUser(profile)
        procedure.createdBy = me.id
        const saved = await this.procedureRepository.create(procedure)
        if (saved)
            await this.auditService.auditCreated(
                me,
                AuditTable.SURGICALPROCEDURE,
                Number(saved.id)
            )

        return saved
    }

    @get('/api/surgicalprocedures/count', new SurgicalProcedureSpect().count())
    @authenticate('jwt')
    async count(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('where', getWhereSchemaFor(SurgicalProcedure))
        where?: Where<SurgicalProcedure>
    ): Promise<Count> {
        return this.procedureRepository.count(where)
    }

    @get('/api/surgicalprocedures', new SurgicalProcedureSpect().found())
    @authenticate('jwt')
    async find(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('filter', getFilterSchemaFor(SurgicalProcedure))
        filter?: Filter<SurgicalProcedure>
    ): Promise<SurgicalProcedure[]> {
        return this.procedureRepository.find(filter)
    }

    @patch(
        '/api/surgicalprocedures',
        new SurgicalProcedureSpect().count('SurgicalProcedure PATCH success count')
    )
    @authenticate('jwt')
    async updateAll(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new SurgicalProcedureSpect().partial())
        procedure: SurgicalProcedure,
        @param.query.object('where', getWhereSchemaFor(SurgicalProcedure))
        where?: Where<SurgicalProcedure>
    ): Promise<Count> {
        return this.procedureRepository.updateAll(procedure, where)
    }

    @get('/api/surgicalprocedure/{id}', new SurgicalProcedureSpect().created())
    @authenticate('jwt')
    async findById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<SurgicalProcedure> {
        return this.procedureRepository.findById(id)
    }

    @patch('/api/surgicalprocedure/{id}', new SurgicalProcedureSpect().simple('SurgicalProcedure PATCH success'))
    @authenticate('jwt')
    async updateById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new SurgicalProcedureSpect().update())
        procedure: SurgicalProcedure
    ): Promise<void> {
        const me: User = await this.acountService.convertToUser(profile)
        procedure.createdBy = me.id

        try {
            await this.procedureRepository.updateById(id, procedure)
            const log = new SurgicalProcedure({
               name: procedure.name
            })
            await this.auditService.auditUpdated(
                me,
                AuditTable.SURGICALPROCEDURE,
                id,
                JSON.stringify(log)
            )
        } catch (err) {
            throw new HttpErrors.Conflict('ERROR_UPDATING')
        }
    }

    @put('/api/surgicalprocedure/{id}', new SurgicalProcedureSpect().simple('SurgicalProcedure PUT success'))
    @authenticate('jwt')
    async replaceById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody() procedure: SurgicalProcedure
    ): Promise<void> {
        await this.procedureRepository.replaceById(id, procedure)
    }

    @del('/api/surgicalprocedure/{id}', new SurgicalProcedureSpect().simple('SurgicalProcedure DELETE success'))
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.procedureRepository.deleteById(id)
            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.SURGICALPROCEDURE,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
