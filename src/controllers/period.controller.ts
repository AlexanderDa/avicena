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
import { Period, User } from '../models'
import { PeriodRepository, Credentials } from '../repositories'
import { UserBindings } from '../keys'
import { AccountBindings } from '../keys'
import { AuditBindings } from '../keys'
import { AccountService } from '../services/account.service'
import { AuditService, AuditTable } from '../services/audit.service'
import { PeriodSpect } from './specs/period.spect'

export class PeriodController {
    constructor(
        @repository(PeriodRepository) public periodRepository: PeriodRepository,
        @inject(UserBindings.USER_SERVICE)
        public userService: UserService<User, Credentials>,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/period', new PeriodSpect().created())
    @authenticate('jwt')
    async create(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new PeriodSpect().create()) period: Omit<Period, 'id'>
    ): Promise<Period> {
        const me: User = await this.acountService.convertToUser(profile)
        period.createdBy = me.id
        const saved = await this.periodRepository.create(period)
        if (saved)
            await this.auditService.auditCreated(
                me,
                AuditTable.PERIOD,
                Number(saved.id)
            )

        return saved
    }

    @get('/api/periods/count', new PeriodSpect().count())
    @authenticate('jwt')
    async count(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('where', getWhereSchemaFor(Period))
        where?: Where<Period>
    ): Promise<Count> {
        return this.periodRepository.count(where)
    }

    @get('/api/periods', new PeriodSpect().found())
    @authenticate('jwt')
    async find(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('filter', getFilterSchemaFor(Period))
        filter?: Filter<Period>
    ): Promise<Period[]> {
        return this.periodRepository.find(filter)
    }

    @patch(
        '/api/periods',
        new PeriodSpect().count('Period PATCH success count')
    )
    @authenticate('jwt')
    async updateAll(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new PeriodSpect().partial())
        period: Period,
        @param.query.object('where', getWhereSchemaFor(Period))
        where?: Where<Period>
    ): Promise<Count> {
        return this.periodRepository.updateAll(period, where)
    }

    @get('/api/period/{id}', new PeriodSpect().created())
    @authenticate('jwt')
    async findById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<Period> {
        return this.periodRepository.findById(id)
    }

    @patch('/api/period/{id}', new PeriodSpect().simple('Period PATCH success'))
    @authenticate('jwt')
    async updateById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new PeriodSpect().update())
        period: Period
    ): Promise<void> {
        const me: User = await this.acountService.convertToUser(profile)
        period.createdBy = me.id

        try {
            await this.periodRepository.updateById(id, period)
            const log = new Period({
                startDate: period.startDate,
                finishDate: period.finishDate,
                isActive: period.isActive
            })
            await this.auditService.auditUpdated(
                me,
                AuditTable.PERIOD,
                id,
                JSON.stringify(log)
            )
        } catch (err) {
            throw new HttpErrors.Conflict('ERROR_UPDATING')
        }
    }

    @put('/api/period/{id}', new PeriodSpect().simple('Period PUT success'))
    @authenticate('jwt')
    async replaceById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody() period: Period
    ): Promise<void> {
        await this.periodRepository.replaceById(id, period)
    }

    @del('/api/period/{id}', new PeriodSpect().simple('Period DELETE success'))
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.periodRepository.deleteById(id)
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
