import { model } from '@loopback/repository'
import { property } from '@loopback/repository'
import { MyModel } from '.'

@model()
export class Audit extends MyModel {
    @property({
        type: 'number',
        id: true,
        generated: true
    })
    id?: number

    @property({
        type: 'string'
    })
    tableName?: string

    @property({
        type: 'string'
    })
    action?: string

    @property({
        type: 'number'
    })
    elementId?: number

    @property({
        type: 'string'
    })
    log?: string

    constructor(data?: Partial<Audit>) {
        super(data)
    }
}

export interface AuditRelations {
    // describe navigational properties here
}

export type AuditWithRelations = Audit & AuditRelations
