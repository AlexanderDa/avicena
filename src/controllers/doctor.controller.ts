import { inject } from '@loopback/context'
import { Count } from '@loopback/repository'
import { Filter } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { Where } from '@loopback/repository'
import { post, HttpErrors } from '@loopback/rest'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'
import { getFilterSchemaFor } from '@loopback/rest'
import { getWhereSchemaFor } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { authenticate, UserService } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { UserProfile } from '@loopback/security'
import { Doctor, User } from '../models'
import { DoctorRepository, PersonalRepository, UserRepository } from '../repositories'
import { Credentials } from '../../common/Credentials'
import { UserBindings } from '../keys'
import { AccountBindings } from '../keys'
import { AuditBindings } from '../keys'
import { AccountService } from '../services/account.service'
import { AuditService, AuditTable } from '../services/audit.service'
import { DoctorSpect } from './specs/doctor.spect'
import { Roles } from '../../common/Roles'

export class DoctorController {
    constructor(
        @repository(DoctorRepository)
        public doctorRepository: DoctorRepository,
        @repository(PersonalRepository)
        public personalRepository: PersonalRepository,
        @repository(UserRepository)
        public userRepository: UserRepository,
        @inject(UserBindings.USER_SERVICE)
        public userService: UserService<User, Credentials>,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/doctor', new DoctorSpect().created())
    @authenticate('jwt')
    async create(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new DoctorSpect().create()) doctor: Omit<Doctor, 'id'>
    ): Promise<Doctor> {
        const me: User = await this.acountService.convertToUser(profile)
        const personal = await this.personalRepository.findById(
            doctor.personalId
        )
        if (!personal) throw new HttpErrors.Unauthorized('NO_PRERSONAL')

        const user = await this.userRepository.findById(personal.userId)
        if (!user) throw new HttpErrors.Unauthorized('NO_USER')
        if (user.roleId !== Roles.Medico.ID) throw new HttpErrors.Unauthorized('NO_DOCTOR')

        const myDoctor: Doctor = new Doctor({
            createdBy: me.id,
            lastName: personal.lastName,
            firstName: personal.firstName,
            dni: personal.dni,
            passport: personal.passport,
            telephone: personal.telephone,
            mobile: personal.mobile,
            regProfessional: doctor.regProfessional,
            emailAddress: personal.emailAddress,
            address: personal.address,
            isHired: doctor.isHired,
            personalId: doctor.personalId
        })

        const saved = await this.doctorRepository.create(myDoctor)
        if (saved)
            await this.auditService.auditCreated(
                me,
                AuditTable.DOCTOR,
                Number(saved.id)
            )

        return saved
    }

    @get('/api/doctors/count', new DoctorSpect().count())
    @authenticate('jwt')
    async count(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('where', getWhereSchemaFor(Doctor))
        where?: Where<Doctor>
    ): Promise<Count> {
        return this.doctorRepository.count(where)
    }

    @get('/api/doctors', new DoctorSpect().found())
    @authenticate('jwt')
    async find(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('filter', getFilterSchemaFor(Doctor))
        filter?: Filter<Doctor>
    ): Promise<Doctor[]> {
        return this.doctorRepository.find(filter)
    }

    /*@patch(
        '/api/doctors',
        new DoctorSpect().count('Doctor PATCH success count')
    )
    @authenticate('jwt')
    async updateAll(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new DoctorSpect().partial())
        doctor: Doctor,
        @param.query.object('where', getWhereSchemaFor(Doctor))
        where?: Where<Doctor>
    ): Promise<Count> {
        return this.doctorRepository.updateAll(doctor, where)
    }*/

    @get('/api/doctor/{id}', new DoctorSpect().created())
    @authenticate('jwt')
    async findById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<Doctor> {
        return this.doctorRepository.findById(id)
    }

    @patch('/api/doctor/{id}', new DoctorSpect().simple('Doctor PATCH success'))
    @authenticate('jwt')
    async updateById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new DoctorSpect().update())
        doctor: Doctor
    ): Promise<void> {
        const personal = await this.personalRepository.findById(
            doctor.personalId
        )
        if (!personal) throw new HttpErrors.Unauthorized('NO_PRERSONAL')


        const myDoctor: Doctor = new Doctor({
            lastName: personal.lastName,
            firstName: personal.firstName,
            dni: personal.dni,
            passport: personal.passport,
            telephone: personal.telephone,
            mobile: personal.mobile,
            regProfessional: doctor.regProfessional,
            emailAddress: personal.emailAddress,
            address: personal.address,
            isHired: doctor.isHired,
            personalId: doctor.personalId
        })
        await this.doctorRepository.updateById(id, myDoctor)
    }

    @del('/api/doctor/{id}', new DoctorSpect().simple('Doctor DELETE success'))
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.doctorRepository.deleteById(id)
            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.DOCTOR,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
