import { model } from '@loopback/repository'
import { belongsTo } from '@loopback/repository'
import { property } from '@loopback/repository'
import { MyModel } from '.'
import { Doctor } from './doctor.model'
import { Period } from './period.model'
import { Surgeryroom } from './surgeryroom.model'
import { SurgicalProcedure } from './surgical-procedure.model'
import { Patient } from './patient.model'

@model({
    settings: {
        foreignKeys: {
            fkReservationDoctor: {
                name: 'fk_reservation_doctor',
                entity: 'Doctor',
                entityKey: 'id',
                foreignKey: 'doctorid'
            },
            fkReservationPatient: {
                name: 'fk_reservation_patient',
                entity: 'Patient',
                entityKey: 'id',
                foreignKey: 'patientid'
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

    @belongsTo(() => Period)
    periodId: number

    @belongsTo(() => Surgeryroom)
    surgeryroomId: number

    @belongsTo(() => SurgicalProcedure)
    procedureId: number

    @belongsTo(() => Patient)
    patientId: number

    constructor(data?: Partial<Reservation>) {
        super(data)
    }
}

export interface ReservationRelations {
    // describe navigational properties here
}

export type ReservationWithRelations = Reservation & ReservationRelations
