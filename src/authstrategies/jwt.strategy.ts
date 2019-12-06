import { inject } from '@loopback/context'
import { HttpErrors } from '@loopback/rest'
import { Request } from '@loopback/rest'
import { AuthenticationStrategy } from '@loopback/authentication'
import { TokenService } from '@loopback/authentication'
import { UserProfile } from '@loopback/security'

import { TokenBindings } from '../keys'

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
    name = 'jwt'

    constructor(
        @inject(TokenBindings.TOKEN_SERVICE)
        public tokenService: TokenService
    ) {}

    // eslint-disable-next-line
    // @ts-ignore
    async authenticate(request: Request): Promise<UserProfile | undefined> {
        const token: string = this.extractCredentials(request)
        // eslint-disable-next-line
        // @ts-ignore
        const userProfile: UserProfile = await this.tokenService.verifyToken(
            token
        )
        return userProfile
    }

    extractCredentials(request: Request): string {
        if (!request.headers.authorization) {
            throw new HttpErrors.Unauthorized('NO_TOKEN')
        }

        // for example: Bearer xxx.yyy.zzz
        const authHeaderValue = request.headers.authorization

        if (!authHeaderValue.startsWith('Bearer')) {
            throw new HttpErrors.Unauthorized('NO_BEARER_TOKEN')
        }

        //split the string into 2 parts: 'Bearer ' and the `xxx.yyy.zzz`
        const parts = authHeaderValue.split(' ')
        if (parts.length !== 2)
            throw new HttpErrors.Unauthorized('INVALID_TOKEN')
        const token = parts[1]

        return token
    }
}
