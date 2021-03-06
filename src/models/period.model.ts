import { model } from '@loopback/repository'
import { property } from '@loopback/repository'
import { MyModel } from '.'

@model()
export class Period extends MyModel {
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
    startDate: string

    @property({
        type: 'date',
        required: true
    })
    finishDate: string

    @property({
        type: 'string',
        required: true,
        length: 50,
        postgresql: {
            dataType: 'character varying',
            dataLength: 50
        }
    })
    label?: string

    @property({
        type: 'boolean',
        default: true
    })
    isActive?: boolean

    constructor(data?: Partial<Period>) {
        super(data)
    }
}

export interface PeriodRelations {
    // describe navigational properties here
}

export type PeriodWithRelations = Period & PeriodRelations
