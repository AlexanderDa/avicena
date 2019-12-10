import { inject } from '@loopback/context'
import * as multer from 'multer'
import { UserRepository } from '../repositories'
import { repository } from '@loopback/repository'
import { post, put, param } from '@loopback/rest'
import { RestBindings } from '@loopback/rest'
import { get } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { Request } from '@loopback/rest'
import { Response } from '@loopback/rest'
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

    @post('/api/account/avatar', new AccountSpects().newAvatar())
    @authenticate('jwt')
    async createAvatar(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new AccountSpects().newFile())
        req: Request,
        @inject(RestBindings.Http.RESPONSE) res: Response
    ): Promise<object> {
        const storage = this.fileService.imageStorage(req, res)
        const upload = multer({ storage })
        return new Promise<object>((resolve, reject) => {
            // eslint-disable-next-line
            upload.any()(req, res, async err => {
                if (err) reject(err)
                else {
                    const user: User = await this.acountService.convertToUser(
                        profile
                    )
                    let image = ''
                    // eslint-disable-next-line
                    const files: any = req.files
                    // eslint-disable-next-line
                    files.forEach(async (element: any) => {
                        const oldImage: URL | undefined = user.image
                            ? new URL(user.image)
                            : undefined
                        image = `${process.env.BASE_URL}/file/image/${element.filename}`
                        await this.userRepository.updateById(user.id, {
                            image: image
                        })
                        if (oldImage) this.fileService.deleteFile(oldImage)
                    })

                    resolve({
                        url: image
                    })
                }
            })
        })
    }
}
