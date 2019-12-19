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
import { Surgeryroom, User } from '../models'
import { SurgeryroomRepository } from '../repositories'
import { Credentials } from '../../common/Credentials'
import { UserBindings } from '../keys'
import { AccountBindings } from '../keys'
import { AuditBindings } from '../keys'
import { AccountService } from '../services/account.service'
import { AuditService, AuditTable } from '../services/audit.service'
import { SurgeryroomSpect } from './specs/surgeryroom.spect'

export class SurgeryroomController {
    constructor(
        @repository(SurgeryroomRepository)
        public surgeryroomRepository: SurgeryroomRepository,
        @inject(UserBindings.USER_SERVICE)
        public userService: UserService<User, Credentials>,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/surgeryroom', new SurgeryroomSpect().created())
    @authenticate('jwt')
    async create(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new SurgeryroomSpect().create())
        surgeryroom: Omit<Surgeryroom, 'id'>
    ): Promise<Surgeryroom> {
        const me: User = await this.acountService.convertToUser(profile)
        surgeryroom.createdBy = me.id
        const saved = await this.surgeryroomRepository.create(surgeryroom)
        if (saved)
            await this.auditService.auditCreated(
                me,
                AuditTable.SURGERYROOM,
                Number(saved.id)
            )

        return saved
    }

    @get('/api/surgeryrooms/count', new SurgeryroomSpect().count())
    @authenticate('jwt')
    async count(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('where', getWhereSchemaFor(Surgeryroom))
        where?: Where<Surgeryroom>
    ): Promise<Count> {
        return this.surgeryroomRepository.count(where)
    }

    @get('/api/surgeryrooms', new SurgeryroomSpect().found())
    @authenticate('jwt')
    async find(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('filter', getFilterSchemaFor(Surgeryroom))
        filter?: Filter<Surgeryroom>
    ): Promise<Surgeryroom[]> {
        return this.surgeryroomRepository.find(filter)
    }

    @patch(
        '/api/surgeryrooms',
        new SurgeryroomSpect().count('Surgeryroom PATCH success count')
    )
    @authenticate('jwt')
    async updateAll(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new SurgeryroomSpect().partial())
        surgeryroom: Surgeryroom,
        @param.query.object('where', getWhereSchemaFor(Surgeryroom))
        where?: Where<Surgeryroom>
    ): Promise<Count> {
        return this.surgeryroomRepository.updateAll(surgeryroom, where)
    }

    @get('/api/surgeryroom/{id}', new SurgeryroomSpect().created())
    @authenticate('jwt')
    async findById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<Surgeryroom> {
        return this.surgeryroomRepository.findById(id)
    }

    @patch(
        '/api/surgeryroom/{id}',
        new SurgeryroomSpect().simple('Surgeryroom PATCH success')
    )
    @authenticate('jwt')
    async updateById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new SurgeryroomSpect().update())
        surgeryroom: Surgeryroom
    ): Promise<void> {
        const me: User = await this.acountService.convertToUser(profile)
        surgeryroom.createdBy = me.id

        try {
            await this.surgeryroomRepository.updateById(id, surgeryroom)
            const log = new Surgeryroom({
                name: surgeryroom.name,
                minValue: surgeryroom.minValue
            })
            await this.auditService.auditUpdated(
                me,
                AuditTable.SURGERYROOM,
                id,
                JSON.stringify(log)
            )
        } catch (err) {
            throw new HttpErrors.Conflict('ERROR_UPDATING')
        }
    }

    @put(
        '/api/surgeryroom/{id}',
        new SurgeryroomSpect().simple('Surgeryroom PUT success')
    )
    @authenticate('jwt')
    async replaceById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody() surgeryroom: Surgeryroom
    ): Promise<void> {
        await this.surgeryroomRepository.replaceById(id, surgeryroom)
    }

    @del(
        '/api/surgeryroom/{id}',
        new SurgeryroomSpect().simple('Surgeryroom DELETE success')
    )
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.surgeryroomRepository.deleteById(id)
            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.SURGERYROOM,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
