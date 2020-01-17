import { model } from '@loopback/repository'
import { belongsTo } from '@loopback/repository'
import { property } from '@loopback/repository'
import { MyModel } from '.'
import { Doctor } from './doctor.model'
import { Honorary } from './honorary.model'
import { Period } from './period.model'
import { Surgeryroom } from './surgeryroom.model'
import { SurgicalProcedure } from './surgical-procedure.model'

@model({
    settings: {
        foreignKeys: {
            fkReservationDoctor: {
                name: 'fk_reservation_doctor',
                entity: 'Doctor',
                entityKey: 'id',
                foreignKey: 'doctorid'
            },
            fkReservationHonorary: {
                name: 'fk_reservation_honorary',
                entity: 'Honorary',
                entityKey: 'id',
                foreignKey: 'honoraryid'
            },
            fkReservationPeriod: {
                name: 'fk_reservation_period',
                entity: 'Period',
                entityKey: 'id',
                foreignKey: 'periodid'
            },
            fkReservationSurgeryroom: {
                name: 'fk_reservation_surgery_room',
                entity: 'Surgeryroom',
                entityKey: 'id',
                foreignKey: 'surgeryroomid'
            },
            fkReservationSurgicalProcedure: {
                name: 'fk_reservation_surgical_procedure',
                entity: 'SurgicalProcedure',
                entityKey: 'id',
                foreignKey: 'procedureid'
            }
        }
    }
})
export class Reservation extends MyModel {
    @property({
        type: 'number',
        id: true,
        generated: true
    })
    id?: number

    @property({
        type: 'date',
        required: true
    })
    reservationDate?: string

    @belongsTo(() => Doctor)
    doctorId: number

    @belongsTo(() => Honorary)
    honoraryId: number

    @belongsTo(() => Period)
    periodId: number

    @belongsTo(() => Surgeryroom)
    surgeryroomId: number

    @belongsTo(() => SurgicalProcedure)
    procedureId: number

    constructor(data?: Partial<Reservation>) {
        super(data)
    }
}

export interface ReservationRelations {
    // describe navigational properties here
}

export type ReservationWithRelations = Reservation & ReservationRelations
