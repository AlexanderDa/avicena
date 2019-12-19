import { getModelSchemaRef } from '@loopback/rest'
import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { Surgeryroom } from '../../models'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'
import { Spect } from './stect'

export class SurgeryroomSpect extends Spect {
    create(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Surgeryroom, {
                        title: 'NewSurgeryroom',
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
                            schema: getModelSchemaRef(Surgeryroom, {
                                title: 'CreatedSurgeryroom'
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
                    schema: getModelSchemaRef(Surgeryroom, {
                        title: 'UpdateSurgeryroom',
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
                    schema: getModelSchemaRef(Surgeryroom, {
                        title: 'PartialSurgeryroom',
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
                                items: getModelSchemaRef(Surgeryroom)
                            }
                        }
                    }
                }
            }
        }
    }
}
