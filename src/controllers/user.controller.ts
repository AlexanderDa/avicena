import { inject } from '@loopback/context'
import { Count } from '@loopback/repository'
import { Filter } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { Where } from '@loopback/repository'
import { post } from '@loopback/rest'
import { HttpErrors } from '@loopback/rest'
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
import { User } from '../models'
import { UserRepository } from '../repositories'
import { PasswordHasherBindings } from '../keys'
import { FileBindings } from '../keys'
import { AccountBindings } from '../keys'
import { AuditBindings } from '../keys'
import { PasswordHasher } from '../services/hash.password.bcryptjs'
import { UserSpect } from './specs/user.spect'
import { AccountService } from '../services/account.service'
import { AuditService } from '../services/audit.service'
import { AuditTable } from '../services/audit.service'
import { FileService } from '../services/file.service'

export class UserController {
    constructor(
        @repository(UserRepository)
        public userRepository: UserRepository,
        @inject(FileBindings.FILE_SERVICE)
        public fileService: FileService,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasher,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/user', new UserSpect().created())
    @authenticate('jwt')
    async create(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new UserSpect().create()) user: Omit<User, 'id'>
    ): Promise<User> {
        const me: User = await this.acountService.convertToUser(profile)
        user.createdBy = me.id

        user.password = user.username + 'P4$$'
        // encrypt the password
        // eslint-disable-next-line
        user.password = await this.passwordHasher.hashPassword(user.password)

        try {
            // create the new user
            const savedUser: User = await this.userRepository.create(user)
            delete savedUser.password

            if (savedUser)
                await this.auditService.auditCreated(
                    me,
                    AuditTable.USER,
                    Number(savedUser.id)
                )

            return savedUser
        } catch (err) {
            // PostgresError 23505 duplicate key
            if (err.code === '23505' || err.constraint === 'uniqueEmail') {
                throw new HttpErrors.Conflict('EMAIL_IN_USE')
            } else if (
                err.code === '23505' ||
                err.constraint === 'uniqueUserName'
            ) {
                throw new HttpErrors.Conflict('USERNAME_IN_USE')
            } else {
                throw err
            }
        }
    }

    @get('/api/users/count', new UserSpect().count('User model count'))
    @authenticate('jwt')
    async count(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('where', getWhereSchemaFor(User))
        where?: Where<User>
    ): Promise<Count> {
        return this.userRepository.count(where)
    }

    @get('/api/users', new UserSpect().found())
    @authenticate('jwt')
    async find(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('filter', getFilterSchemaFor(User))
        filter?: Filter<User>
    ): Promise<User[]> {
        return this.userRepository.find(filter)
    }

    @patch('/api/users', new UserSpect().updated('User PATCH success count'))
    @authenticate('jwt')
    async updateAll(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new UserSpect().partial()) user: User,
        @param.query.object('where', getWhereSchemaFor(User))
        where?: Where<User>
    ): Promise<Count> {
        return this.userRepository.updateAll(user, where)
    }

    @get('/api/user/{id}', new UserSpect().created())
    @authenticate('jwt')
    async findById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<User> {
        return this.userRepository.findById(id)
    }

    @patch('/api/user/{id}', new UserSpect().simple('User PATCH successas'))
    @authenticate('jwt')
    async updateById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody() user: User
    ): Promise<void> {
        await this.userRepository.updateById(id, user)
    }

    @put('/api/user/{id}', new UserSpect().simple('User PUT successas'))
    @authenticate('jwt')
    async replaceById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new UserSpect().update()) user: User
    ): Promise<void> {
        await this.userRepository.replaceById(id, user)
    }

    @del('/api/user/{id}', new UserSpect().simple('User DELETE successas'))
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.userRepository.deleteById(id)

            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.USER,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
