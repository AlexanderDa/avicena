import { model } from '@loopback/repository'
import { belongsTo } from '@loopback/repository'
import { property } from '@loopback/repository'
import { MyModel } from '.'
import { Role } from './role.model'

@model({
    name: 'dbuser',
    settings: {
        hiddenProperties: [
            'password',
            'passwordResetToken',
            'passwordResetTokenDate'
        ],
        indexes: {
            uniqueEmail: {
                keys: { emailAddress: 1 },
                options: { unique: true }
            },
            uniqueUserName: {
                keys: { username: 1 },
                options: { unique: true }
            }
        }
    }
})
export class User extends MyModel {
    @property({
        type: 'number',
        id: true,
        generated: true
    })
    id?: number

    @property({
        type: 'string',
        required: true,
        length: 40,
        postgresql: {
            dataType: 'character varying',
            dataLength: 40
        }
    })
    username: string

    @property({
        type: 'string',
        required: true,
        length: 50,
        postgresql: {
            dataType: 'character varying',
            dataLength: 50
        }
    })
    emailAddress: string

    @property({
        type: 'string',
        required: false,
        length: 75,
        postgresql: {
            dataType: 'character varying',
            dataLength: 75
        }
    })
    password: string

    @property({
        type: 'boolean',
        default: true
    })
    isActive?: boolean

    @property({
        type: 'string',
        length: 75,
        postgresql: {
            dataType: 'character varying',
            dataLength: 75
        }
    })
    image?: string

    @property({
        type: 'string',
        length: 10,
        postgresql: {
            dataType: 'character varying',
            dataLength: 10
        }
    })
    passwordResetToken?: string

    @property({
        type: 'date'
    })
    passwordResetTokenDate?: string

    @belongsTo(() => Role)
    roleId: number

    constructor(data?: Partial<User>) {
        super(data)
    }
}

export interface UserRelations {
    // describe navigational properties here
}

export type UserWithRelations = User & UserRelations
