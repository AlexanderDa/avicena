import { model, property } from '@loopback/repository'
import { MyModel } from '.'

@model()
export class SurgicalProcedure extends MyModel {
    @property({
        type: 'number',
        id: true,
        generated: true
    })
    id?: number

    @property({
        type: 'string',
        required: true,
        length: 100,
        postgresql: {
            dataType: 'character varying',
            dataLength: 100,
            nullable: 'NO'
        }
    })
    name: string

    constructor(data?: Partial<SurgicalProcedure>) {
        super(data)
    }
}

export interface SurgicalProcedureRelations {
    // describe navigational properties here
}

export type SurgicalProcedureWithRelations = SurgicalProcedure &
    SurgicalProcedureRelations
