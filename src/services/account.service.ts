import { UserRepository } from '../repositories/user.repository'
import { User } from '../models/user.model'
import { UserProfile } from '@loopback/security'
import { repository } from '@loopback/repository'

export interface AccountService<U, P> {
    convertToUser(userProfile: P): Promise<U>
}

export class MyAccountService implements AccountService<User, UserProfile> {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository
    ) {}

    async convertToUser(userProfile: UserProfile): Promise<User> {
        const result = await this.userRepository.findOne({
            where: {
                emailAddress: userProfile.name
            }
        })

        const user: User = new User(result || undefined)
        return user
    }
}
