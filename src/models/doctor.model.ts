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
        },
        indexes: {
            uniquePersonal: {
                keys: { personalId: 1 },
                options: { unique: true }
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

    @property({
        type: 'string',
        required: true,
        length: 30,
        postgresql: {
            dataType: 'character varying',
            dataLength: 30
        }
    })
    lastName: string

    @property({
        type: 'string',
        required: true,
        length: 30,
        postgresql: {
            dataType: 'character varying',
            dataLength: 30
        }
    })
    firstName: string

    @property({
        type: 'string',
        length: 10,
        postgresql: {
            dataType: 'character varying',
            dataLength: 10
        }
    })
    dni: string

    @property({
        type: 'string',
        length: 15,
        postgresql: {
            dataType: 'character varying',
            dataLength: 15
        }
    })
    passport: string

    @property({
        type: 'string',
        length: 15,
        postgresql: {
            dataType: 'character varying',
            dataLength: 15
        }
    })
    telephone?: string

    @property({
        type: 'string',
        length: 15,
        postgresql: {
            dataType: 'character varying',
            dataLength: 15
        }
    })
    mobile?: string

    @property({
        type: 'string',
        length: 50,
        postgresql: {
            dataType: 'character varying',
            dataLength: 50
        }
    })
    emailAddress?: string

    @property({
        type: 'string',
        length: 25,
        postgresql: {
            dataType: 'character varying',
            dataLength: 25
        }
    })
    regProfessional?: string

    @property({
        type: 'string',
        required: true
    })
    address: string

    @property({
        type: 'boolean',
        default: false,
    })
    isHired: boolean

    @belongsTo(() => Personal, {}, { required: true })
    personalId: number

    constructor(data?: Partial<Doctor>) {
        super(data)
    }
}

export interface DoctorRelations {
    // describe navigational properties here
}

export type DoctorWithRelations = Doctor & DoctorRelations
