import { model, property, belongsTo } from '@loopback/repository'
import { MyModel } from '.'
import { User } from './user.model'

@model({
    settings: {
        foreignKeys: {
            fkPersonalUser: {
                name: 'fk_personal_user',
                entity: 'dbuser',
                entityKey: 'id',
                foreignKey: 'userid'
            }
        }
    }
})
export class Personal extends MyModel {
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
        type: 'string',
        length: 75,
        postgresql: {
            dataType: 'character varying',
            dataLength: 75
        }
    })
    image?: string

    @belongsTo(() => User)
    userId: number

    constructor(data?: Partial<Personal>) {
        super(data)
    }
}

export interface PersonalRelations {
    // describe navigational properties here
}

export type PersonalWithRelations = Personal & PersonalRelations
