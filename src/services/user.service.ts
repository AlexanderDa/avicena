import { inject } from '@loopback/context'
import { HttpErrors } from '@loopback/rest'
import { Credentials } from '../../common/Credentials'
import { UserRepository } from '../repositories/user.repository'
import { User } from '../models/user.model'
import { UserService } from '@loopback/authentication'
import { UserProfile } from '@loopback/security'
import { securityId } from '@loopback/security'
import { repository } from '@loopback/repository'
import { PasswordHasher } from './hash.password.bcryptjs'
import { PasswordHasherBindings } from '../keys'

export class MyUserService implements UserService<User, Credentials> {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasher
    ) {}

    async verifyCredentials(credentials: Credentials): Promise<User> {
        const result = await this.userRepository.findOne({
            where: { emailAddress: credentials.email.toLowerCase() }
        })
        if (!result) throw new HttpErrors.Unauthorized('BAD_ACCOUNT')
        if (!result.confirmed)
            throw new HttpErrors.Unauthorized('INACTIVE_ACCOUNT')

        const user: User = new User(result || undefined)

        const passwordMatched = await this.passwordHasher.comparePassword(
            credentials.password,
            user.password
        )

        if (passwordMatched)
            if (user.isActive === true) return user
            else throw new HttpErrors.Unauthorized('INACTIVE_USER')
        else throw new HttpErrors.Unauthorized('BAD_PASS')
    }
    // eslint-disable-next-line
    // @ts-ignore
    convertToUserProfile(user: User): UserProfile {
        // eslint-disable-next-line
        // @ts-ignore
        return { [securityId]: user.id, name: user.emailAddress }
    }
}
