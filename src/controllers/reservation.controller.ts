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
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { UserProfile } from '@loopback/security'
import { Reservation } from '../models'
import { ReservationRepository } from '../repositories'
import { ReservationSpect } from './specs/reservation.spect'
import { AuditTable } from '../services/audit.service'
import { AuditService } from '../services/audit.service'
import { AccountBindings } from '../keys'
import { AuditBindings } from '../keys'
import { AccountService } from '../services/account.service'

export class ReservationController {
    constructor(
        @repository(ReservationRepository)
        public reservationRepository: ReservationRepository,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/reservation', new ReservationSpect().created())
    @authenticate('jwt')
    async create(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new ReservationSpect().create())
        reservation: Omit<Reservation, 'id'>
    ): Promise<Reservation> {
        return this.reservationRepository.create(reservation)
    }

    @get('/api/reservations/count', new ReservationSpect().count())
    @authenticate('jwt')
    async count(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('where', getWhereSchemaFor(Reservation))
        where?: Where<Reservation>
    ): Promise<Count> {
        return this.reservationRepository.count(where)
    }

    @get('/api/reservations', new ReservationSpect().found())
    @authenticate('jwt')
    async find(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.query.object('filter', getFilterSchemaFor(Reservation))
        filter?: Filter<Reservation>
    ): Promise<Reservation[]> {
        return this.reservationRepository.find(filter)
    }

    @patch('/api/reservation', new ReservationSpect().count())
    @authenticate('jwt')
    async updateAll(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @requestBody(new ReservationSpect().partial())
        reservation: Reservation,
        @param.query.object('where', getWhereSchemaFor(Reservation))
        where?: Where<Reservation>
    ): Promise<Count> {
        return this.reservationRepository.updateAll(reservation, where)
    }

    @get('/api/reservation/{id}', new ReservationSpect().created())
    @authenticate('jwt')
    async findById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<Reservation> {
        return this.reservationRepository.findById(id)
    }

    @patch('/api/reservation/{id}', new ReservationSpect().simple())
    @authenticate('jwt')
    async updateById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new ReservationSpect().partial())
        reservation: Reservation
    ): Promise<void> {
        await this.reservationRepository.updateById(id, reservation)
    }

    @put('/api/reservation/{id}', new ReservationSpect().simple())
    @authenticate('jwt')
    async replaceById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody() reservation: Reservation
    ): Promise<void> {
        await this.reservationRepository.replaceById(id, reservation)
    }

    @del('/api/reservation/{id}', new ReservationSpect().simple())
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.reservationRepository.deleteById(id)
            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.RESERVATION,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
