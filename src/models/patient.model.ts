import { model, property } from '@loopback/repository'
import { MyModel } from '.'

@model()
export class Patient extends MyModel {
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
    dni?: string

    @property({
        type: 'string',
        length: 15,
        postgresql: {
            dataType: 'character varying',
            dataLength: 15
        }
    })
    passport?: string

    @property({
        type: 'date',
        required: true
    })
    bornDate: string

    @property({
        type: 'string',
        required: true,
        options: ['Masculino', 'Femenino'],
        length: 10,
        postgresql: {
            dataType: 'character varying',
            dataLength: 10
        }
    })
    sex: string

    @property({
        type: 'string',
        length: 75,
        postgresql: {
            dataType: 'character varying',
            dataLength: 75
        }
    })
    profession?: string

    @property({
        type: 'string',
        required: true,
        options: ['Soltero', 'Casado', 'Divorciado', 'Viudo'],
        length: 30,
        postgresql: {
            dataType: 'character varying',
            dataLength: 30
        }
    })
    maritalStatus: string

    @property({
        type: 'string',
        required: true
    })
    address: string

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

    constructor(data?: Partial<Patient>) {
        super(data)
    }
}

export interface PatientRelations {
    // describe navigational properties here
}

export type PatientWithRelations = Patient & PatientRelations
