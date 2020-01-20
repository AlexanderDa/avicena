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
import { put } from '@loopback/rest'
import { del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { authenticate, UserService } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { UserProfile } from '@loopback/security'
import { Patient, User } from '../models'
import { PatientRepository } from '../repositories'
import { Credentials } from '../../common/Credentials'
import { UserBindings } from '../keys'
import { AccountBindings } from '../keys'
import { AuditBindings } from '../keys'
import { AccountService } from '../services/account.service'
import { AuditService, AuditTable } from '../services/audit.service'
import { PatientSpect } from './specs/patient.spect'

export class PatientController {
    constructor(
        @repository(PatientRepository)
        public patientRepository: PatientRepository,
        @inject(UserBindings.USER_SERVICE)
        public userService: UserService<User, Credentials>,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/patient', new PatientSpect().created())
    @authenticate('jwt')
    async create(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new PatientSpect().create()) patient: Omit<Patient, 'id'>
    ): Promise<Patient> {
        const me: User = await this.acountService.convertToUser(profile)
        patient.createdBy = me.id
        const saved = await this.patientRepository.create(patient)
        if (saved)
            await this.auditService.auditCreated(
                me,
                AuditTable.PATIENT,
                Number(saved.id)
            )

        return saved
    }

    @get('/api/patients/count', new PatientSpect().count())
    @authenticate('jwt')
    async count(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('where', getWhereSchemaFor(Patient))
        where?: Where<Patient>
    ): Promise<Count> {
        return this.patientRepository.count(where)
    }

    @get('/api/patients', new PatientSpect().found())
    @authenticate('jwt')
    async find(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('filter', getFilterSchemaFor(Patient))
        filter?: Filter<Patient>
    ): Promise<Patient[]> {
        return this.patientRepository.find(filter)
    }

    @patch(
        '/api/patients',
        new PatientSpect().count('Patient PATCH success count')
    )
    @authenticate('jwt')
    async updateAll(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new PatientSpect().partial())
        patient: Patient,
        @param.query.object('where', getWhereSchemaFor(Patient))
        where?: Where<Patient>
    ): Promise<Count> {
        return this.patientRepository.updateAll(patient, where)
    }

    @get('/api/patient/{id}', new PatientSpect().created())
    @authenticate('jwt')
    async findById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<Patient> {
        return this.patientRepository.findById(id)
    }

    @patch(
        '/api/patient/{id}',
        new PatientSpect().simple('Patient PATCH success')
    )
    @authenticate('jwt')
    async updateById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new PatientSpect().update())
        patient: Patient
    ): Promise<void> {
        const me: User = await this.acountService.convertToUser(profile)
        patient.createdBy = me.id

        try {
            await this.patientRepository.updateById(id, patient)
            const log = new Patient({
                lastName: patient.lastName,
                firstName: patient.firstName,
                dni: patient.dni,
                passport: patient.passport,
                bornDate: patient.bornDate,
                sex: patient.sex,
                profession: patient.profession,
                maritalStatus: patient.maritalStatus,
                address: patient.address,
                telephone: patient.telephone,
                mobile: patient.mobile,
                emailAddress: patient.emailAddress
            })
            await this.auditService.auditUpdated(
                me,
                AuditTable.PATIENT,
                id,
                JSON.stringify(log)
            )
        } catch (err) {
            throw new HttpErrors.Conflict('ERROR_UPDATING')
        }
    }

    @put('/api/patient/{id}', new PatientSpect().simple('Patient PUT success'))
    @authenticate('jwt')
    async replaceById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody() patient: Patient
    ): Promise<void> {
        await this.patientRepository.replaceById(id, patient)
    }

    @del(
        '/api/patient/{id}',
        new PatientSpect().simple('Patient DELETE success')
    )
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.patientRepository.deleteById(id)
            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.PATIENT,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
