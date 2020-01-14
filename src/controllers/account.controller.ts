import { inject } from '@loopback/context'
import { UserRepository } from '../repositories'
import { repository } from '@loopback/repository'
import { post, put, param, HttpErrors } from '@loopback/rest'
import { get } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { User } from '../models'
import { authenticate } from '@loopback/authentication'
import { TokenService } from '@loopback/authentication'
import { UserService } from '@loopback/authentication'
import { UserProfile } from '@loopback/security'
import { SecurityBindings } from '@loopback/security'
import { Credentials } from '../../common/Credentials'
import { PasswordHasher } from '../services/hash.password.bcryptjs'
import { TokenBindings, FileBindings } from '../keys'
import { AccountBindings } from '../keys'
import { PasswordHasherBindings } from '../keys'
import { UserBindings } from '../keys'
import { OPERATION_SECURITY_SPEC } from '../utils/security.spec'
import { AccountService } from '../services/account.service'
import { UserSpect } from './specs/user.spect'
import AccountSpects from './specs/account.spect'
import { FileService } from '../services/file.service'

// Uncomment these imports to begin using these cool features!

export class AccountController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasher,
        @inject(TokenBindings.TOKEN_SERVICE) public jwtService: TokenService,
        @inject(FileBindings.FILE_SERVICE) public fileService: FileService,
        @inject(UserBindings.USER_SERVICE)
        public userService: UserService<User, Credentials>,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService
    ) {}

    @get('/api/account/me', new UserSpect().created())
    @authenticate('jwt')
    async currentUser(
        @inject(SecurityBindings.USER) profile: UserProfile
    ): Promise<User> {
        return this.acountService.convertToUser(profile)
    }

    @get('/api/account/{email}', new UserSpect().created())
    @authenticate('jwt')
    async userByEmailAddress(
        @param.path.string('email') emailAddress: string
    ): Promise<User> {
        const result = await this.userRepository.findOne({
            where: { emailAddress }
        })

        const user: User = new User(result || undefined)
        return user
    }

    @post('/api/account/login', new AccountSpects().logged())
    async login(
        @requestBody(new AccountSpects().login())
        credentials: Credentials
    ): Promise<{ token: string }> {
        // ensure the user exists, and the password is correct
        const user = await this.userService.verifyCredentials(credentials)

        // convert a User object into a UserProfile object (reduced set of properties)
        const userProfile = this.userService.convertToUserProfile(user)

        // create a JSON Web Token based on the user profile
        const token = await this.jwtService.generateToken(userProfile)

        return { token }
    }

    @put('/api/account/change/password', {
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {}
        }
    })
    @authenticate('jwt')
    async changePassword(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new AccountSpects().changePass())
        req: { password: string }
    ): Promise<{ updated: boolean }> {
        const user: User = await this.acountService.convertToUser(profile)
        const password = await this.passwordHasher.hashPassword(req.password)
        await this.userRepository.updateById(user.id, { password })
        return { updated: true }
    }

    @put('/api/account/activation', new AccountSpects().logged())
    async activationAccount(
        @requestBody(new AccountSpects().activateAccount())
        req: {
            emailAddress: string
            password: string
            activationCode: string
        }
    ): Promise<{ token: string }> {
        const user = await this.userRepository.findOne({
            where: { emailAddress: req.emailAddress }
        })
        if (!user) throw new HttpErrors.Unauthorized('BAD_ACCOUNT')
        if (user.confirmationCode !== req.activationCode)
            throw new HttpErrors.Unauthorized('BAD_CODE')
        if (user.confirmed) throw new HttpErrors.Unauthorized('ACTIVED_ACCOUNT')

        user.password = await this.passwordHasher.hashPassword(req.password)
        user.confirmed = true

        await this.userRepository.updateById(user.id, user)
        // convert a User object into a UserProfile object (reduced set of properties)
        const userProfile = this.userService.convertToUserProfile(user)

        // create a JSON Web Token based on the user profile
        const token = await this.jwtService.generateToken(userProfile)

        return { token }
    }
}
