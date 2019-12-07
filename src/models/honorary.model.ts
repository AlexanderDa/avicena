import { model } from '@loopback/repository'
import { property } from '@loopback/repository'
import { MyModel } from '.'

@model()
export class Honorary extends MyModel {
    @property({
        type: 'number',
        id: true,
        generated: true
    })
    id?: number

    @property({
        type: 'string',
        required: false,
        length: 50,
        postgresql: {
            columnName: 'description',
            dataType: 'character varying',
            dataLength: 50
        }
    })
    description: string

    @property({
        type: 'number',
        required: true,
        postgresql: {
            dataType: 'real'
        }
    })
    value: number

    @property({
        type: 'number',
        required: true,
        postgresql: {
            dataType: 'real'
        }
    })
    rate: number

    @property({
        type: 'number',
        required: true,
        postgresql: {
            dataType: 'real'
        }
    })
    mps: number

    constructor(data?: Partial<Honorary>) {
        super(data)
    }
}

export interface HonoraryRelations {
    // describe navigational properties here
}

export type HonoraryWithRelations = Honorary & HonoraryRelations
