import { getModelSchemaRef } from '@loopback/rest'
import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { Reservation } from '../../models'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'
import { Spect } from './stect'

export class ReservationSpect extends Spect {
    create(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Reservation, {
                        title: 'NewReservation',
                        exclude: ['createdBy', 'createdAt', 'id']
                    })
                }
            }
        }
    }

    created(): OperationObject {
        return {
            security: OPERATION_SECURITY_SPEC,
            responses: {
                '200': {
                    content: {
                        'application/json': {
                            schema: getModelSchemaRef(Reservation, {
                                title: 'CreatedReservation'
                            })
                        }
                    }
                }
            }
        }
    }

    update(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Reservation, {
                        title: 'UpdateReservation',
                        exclude: ['createdBy', 'createdAt']
                    })
                }
            }
        }
    }

    partial(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Reservation, {
                        title: 'PartialReservation',
                        partial: true,
                        exclude: ['createdBy', 'createdAt']
                    })
                }
            }
        }
    }

    found(): OperationObject {
        return {
            security: OPERATION_SECURITY_SPEC,
            responses: {
                '200': {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: getModelSchemaRef(Reservation)
                            }
                        }
                    }
                }
            }
        }
    }
}
