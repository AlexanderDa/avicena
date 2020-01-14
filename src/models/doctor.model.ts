import { model } from '@loopback/repository'
import { belongsTo } from '@loopback/repository'
import { property } from '@loopback/repository'
import { MyModel } from '.'
import { Personal } from './personal.model'

@model({
    settings: {
        foreignKeys: {
            fkDoctorPersonal: {
                name: 'fk_doctor_personal',
                entity: 'Personal',
                entityKey: 'id',
                foreignKey: 'personalid'
            }
        }
    }
})
export class Doctor extends MyModel {
    @property({
        type: 'number',
        id: true,
        generated: true
    })
    id?: number

    @belongsTo(() => Personal)
    personalId: number

    constructor(data?: Partial<Doctor>) {
        super(data)
    }
}

export interface DoctorRelations {
    // describe navigational properties here
}

export type DoctorWithRelations = Doctor & DoctorRelations
