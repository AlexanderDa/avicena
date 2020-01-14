import { inject } from '@loopback/context'
import { UserRepository, PersonalRepository } from '../repositories'
import { repository } from '@loopback/repository'
import { param, HttpErrors } from '@loopback/rest'
import { post } from '@loopback/rest'
import { authenticate } from '@loopback/authentication'
import { EmailBindings } from '../keys'
import { AccountBindings } from '../keys'
import { AccountService } from '../services/account.service'
import { EmailService } from '../services/email.service'
import { OPERATION_SECURITY_SPEC } from '../utils/security.spec'

// Uncomment these imports to begin using these cool features!

export class EmailController {
    constructor(
        @repository(PersonalRepository)
        public personalRepository: PersonalRepository,
        @repository(UserRepository)
        public userRepository: UserRepository,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(EmailBindings.EMAIL_SERVICE)
        public emailService: EmailService
    ) {}

    @post('/api/email/welcome/{email}', {
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {}
        }
    })
    @authenticate('jwt')
    async welcomeEmail(
        @param.path.string('email') emailAddress: string
    ): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { emailAddress }
        })
        if (!user) throw new HttpErrors.Unauthorized('BAD_ACCOUNT')
        if (user.confirmed) throw new HttpErrors.Unauthorized('ACTIVED_ACCOUNT')

        const personal = await this.personalRepository.findOne({
            where: { userId: user.id }
        })
        if (!personal) throw new HttpErrors.Unauthorized('NO_PRERSONAL')

        await this.emailService.welcome(
            personal.firstName,
            user.emailAddress,
            user.confirmationCode
        )
    }
}
