import { Main } from './application'
import '../../environment'

import { repository } from '@loopback/repository'
import { Count } from '@loopback/repository'
import { User } from './models'
import { Role } from './models'
import { PgconfigDataSource } from './datasources'
import { inject } from '@loopback/core'
import { RoleRepository } from './repositories'
import { SimpleUserRepository } from './repositories'
import { BcryptHasher } from './services/hash.password.bcryptjs'
import { PasswordHasherBindings } from './keys'
import { Roles } from '../common/Roles'

class DefaultValues {
    @repository(SimpleUserRepository)
    public userRepository: SimpleUserRepository
    @repository(RoleRepository) public roleRepository: RoleRepository
    @inject(PasswordHasherBindings.ROUNDS) private readonly rounds: number
    public passwordHasher: BcryptHasher
    constructor() {
        this.userRepository = new SimpleUserRepository(new PgconfigDataSource())
        this.roleRepository = new RoleRepository(new PgconfigDataSource())
        this.passwordHasher = new BcryptHasher(this.rounds)
    }

    public async migrate(): Promise<void> {
        await this.saveRoles()
        await this.saveUser()
    }
    private async saveRoles(): Promise<void> {
        // Migrate Admin Role
        if (!(await this.roleRepository.exists(Roles.Admin.ID))) {
            const admin: Role = new Role({
                id: Roles.Admin.ID,
                name: Roles.Admin.NAME
            })
            const adminSaved: Role = await this.roleRepository.create(admin)
            console.log('migrated: ', adminSaved)
        }

        // Migrate Medico Role
        if (!(await this.roleRepository.exists(Roles.Medico.ID))) {
            const medico: Role = new Role({
                id: Roles.Medico.ID,
                name: Roles.Medico.NAME
            })
            const medicoSaved: Role = await this.roleRepository.create(medico)
            console.log('migrated: ', medicoSaved)
        }
    }

    private async saveUser(): Promise<void> {
        const users: Count = await this.userRepository.count({
            roleId: Roles.Admin.ID
        })
        if (users.count < 1) {
            const user: User = new User({
                username: 'admin',
                emailAddress: 'admin@gmail.com',
                password: await this.passwordHasher.hashPassword('adminP4$$'),
                roleId: Roles.Admin.ID
            })
            const savedUser: User = await this.userRepository.create(user)
            console.log('migrated: ', savedUser)
        }
    }
}

export async function migrate(args: string[]) {
    const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter'
    console.log('Migrating schemas (%s existing schema)', existingSchema)

    const app = new Main()
    await app.boot()
    await app.migrateSchema({ existingSchema })

    // Default Values
    const values: DefaultValues = new DefaultValues()
    await values.migrate()

    // Connectors usually keep a pool of opened connections,
    // this keeps the process running even after all work is done.
    // We need to exit explicitly.
    process.exit(0)
}

migrate(process.argv).catch(err => {
    console.error('Cannot migrate database schema', err)
    process.exit(1)
})
