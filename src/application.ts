import { BootMixin } from '@loopback/boot'
import { ApplicationConfig } from '@loopback/core'
import { BindingKey } from '@loopback/core'
import { RestExplorerBindings } from '@loopback/rest-explorer'
import { RestExplorerComponent } from '@loopback/rest-explorer'
import { RepositoryMixin } from '@loopback/repository'
import { RestApplication } from '@loopback/rest'
import { ServiceMixin } from '@loopback/service-proxy'
import { join, resolve } from 'path'
import { MySequence } from './sequence'
import { AuthenticationComponent } from '@loopback/authentication'
import { registerAuthenticationStrategy } from '@loopback/authentication'
import { TokenBindings } from './keys'
import { FileBindings } from './keys'
import { PasswordHasherBindings } from './keys'
import { AccountBindings } from './keys'
import { AuditBindings } from './keys'
import { UserBindings } from './keys'
import { BcryptHasher } from './services/hash.password.bcryptjs'
import { MyAccountService } from './services/account.service'
import { MyAuditService } from './services/audit.service'
import { SECURITY_SCHEME_SPEC } from './utils/security.spec'
import { JWTService } from './services/jwt.service'
import { MyUserService } from './services/user.service'
import { JWTAuthenticationStrategy } from './authstrategies/jwt.strategy'
import { MyFileService } from './services/file.service'

/**
 * Information from package.json
 */
export interface PackageInfo {
    name: string
    version: string
    description: string
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package')

const pkg: PackageInfo = require('../../package.json')

export class Main extends BootMixin(
    ServiceMixin(RepositoryMixin(RestApplication))
) {
    constructor(options: ApplicationConfig = {}) {
        super(options)

        this.api({
            openapi: '3.0.0',
            info: { title: pkg.name, version: pkg.version },
            paths: {},
            components: { securitySchemes: SECURITY_SCHEME_SPEC },
            servers: [{ url: '/' }]
        })

        this.setUpBindings()

        // Bind authentication component related elements
        this.component(AuthenticationComponent)

        registerAuthenticationStrategy(this, JWTAuthenticationStrategy)

        // Set up the custom sequence
        this.sequence(MySequence)

        // Set up default home page
        this.static('/', join(__dirname, '../../public'))

        // Set image route
        this.static(
            '/file/image',
            resolve(`${process.env.LOADING_ROUTE}/images`)
        )

        // Customize @loopback/rest-explorer configuration here
        this.bind(RestExplorerBindings.CONFIG).to({
            path: '/api/explorer'
        })
        this.component(RestExplorerComponent)

        this.projectRoot = __dirname
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true
            }
        }
    }

    setUpBindings(): void {
        // Bind package.json to the application context
        this.bind(PackageKey).to(pkg)

        this.bind(TokenBindings.TOKEN_SECRET).to(process.env.TOKEN_SECRET || '')

        this.bind(TokenBindings.TOKEN_EXPIRES_IN).to(
            process.env.TOKEN_EXPIRES || ''
        )

        // eslint-disable-next-line
        // @ts-ignore
        this.bind(TokenBindings.TOKEN_SERVICE).toClass(JWTService)

        // // Bind bcrypt hash services
        this.bind(PasswordHasherBindings.ROUNDS).to(10)
        this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher)

        // eslint-disable-next-line
        // @ts-ignore
        this.bind(UserBindings.USER_SERVICE).toClass(MyUserService)

        // Account serices
        this.bind(AccountBindings.ACCOUNT_SERVICE).toClass(MyAccountService)

        // Audit service
        this.bind(AuditBindings.AUDIT_SERVICE).toClass(MyAuditService)

        // file service
        this.bind(FileBindings.FILE_SERVICE).toClass(MyFileService)
    }
}
