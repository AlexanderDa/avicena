import { model } from '@loopback/repository'
import { property } from '@loopback/repository'
import { MyModel } from './mymodel.model'

@model()
export class Surgeryroom extends MyModel {
    @property({
        type: 'number',
        id: true,
        generated: true
    })
    id?: number

    @property({
        type: 'string',
        length: 100,
        postgresql: {
            dataType: 'character varying',
            dataLength: 100
        }
    })
    name?: string

    @property({
        type: 'number',
        postgresql: {
            dataType: 'real'
        }
    })
    minValue?: number

    @property({
        type: 'boolean',
        default: true
    })
    isActive?: boolean

    constructor(data?: Partial<Surgeryroom>) {
        super(data)
    }
}

export interface SurgeryroomRelations {
    // describe navigational properties here
}

export type SurgeryRoomWithRelations = Surgeryroom & SurgeryroomRelations
