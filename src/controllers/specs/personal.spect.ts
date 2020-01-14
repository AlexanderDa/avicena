import { getModelSchemaRef } from '@loopback/rest'
import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { Personal } from '../../models'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'
import { Spect } from './stect'

export class PersonalSpect extends Spect {
    create(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Personal, {
                        title: 'NewPersonal',
                        exclude: ['createdBy', 'createdAt', 'id', 'image']
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
                            schema: getModelSchemaRef(Personal, {
                                title: 'CreatedPersonal'
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
                    schema: getModelSchemaRef(Personal, {
                        title: 'UpdatePersonal',
                        exclude: ['createdBy', 'createdAt', 'image']
                    })
                }
            }
        }
    }

    partial(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Personal, {
                        title: 'PartialPersonal',
                        partial: true,
                        exclude: ['createdBy', 'createdAt', 'image']
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
                                items: getModelSchemaRef(Personal)
                            }
                        }
                    }
                }
            }
        }
    }
}
