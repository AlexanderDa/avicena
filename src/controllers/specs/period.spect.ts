import { getModelSchemaRef } from '@loopback/rest'
import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { Period } from '../../models'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'
import { Spect } from './stect'

export class PeriodSpect extends Spect {
    create(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Period, {
                        title: 'NewPeriod',
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
                            schema: getModelSchemaRef(Period, {
                                title: 'CreatedPeriod'
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
                    schema: getModelSchemaRef(Period, {
                        title: 'UpdatePeriod',
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
                    schema: getModelSchemaRef(Period, {
                        title: 'PartialPeriod',
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
                                items: getModelSchemaRef(Period)
                            }
                        }
                    }
                }
            }
        }
    }
}
