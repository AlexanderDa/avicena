import { BindingKey } from '@loopback/context'
import { PasswordHasher } from './services/hash.password.bcryptjs'
import { TokenService } from '@loopback/authentication'
import { UserService } from '@loopback/authentication'
import { User } from './models'
import { Credentials } from '../common/Credentials'
import { AccountService } from './services/account.service'
import { AuditService } from './services/audit.service'
import { FileService } from './services/file.service'
import { EmailService } from './services/email.service'

// Send Mail
// https://stackoverflow.com/questions/57182231/send-email-with-loopback-4

export namespace TokenBindings {
    export const TOKEN_SECRET = BindingKey.create<string>(
        'authentication.jwt.secret'
    )
    export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
        'authentication.jwt.expires.in.seconds'
    )
    export const TOKEN_SERVICE = BindingKey.create<TokenService>(
        'services.authentication.jwt.tokenservice'
    )
}

export namespace PasswordHasherBindings {
    export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
        'services.hasher'
    )
    export const ROUNDS = BindingKey.create<number>('services.hasher.round')
}

export namespace UserBindings {
    export const USER_SERVICE = BindingKey.create<
        UserService<User, Credentials>
    >('services.user.service')
}

export namespace AccountBindings {
    export const ACCOUNT_SERVICE = BindingKey.create<AccountService>(
        'services.account.service'
    )
}

export namespace EmailBindings {
    export const EMAIL_SERVICE = BindingKey.create<EmailService>(
        'services.email.service'
    )
}

export namespace AuditBindings {
    export const AUDIT_SERVICE = BindingKey.create<AuditService>(
        'services.audit.service'
    )
}

export namespace FileBindings {
    export const FILE_SERVICE = BindingKey.create<FileService>(
        'services.file.service'
    )
}
