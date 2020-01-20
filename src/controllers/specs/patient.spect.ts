import { getModelSchemaRef } from '@loopback/rest'
import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { Patient } from '../../models'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'
import { Spect } from './stect'

export class PatientSpect extends Spect {
    create(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Patient, {
                        title: 'NewPatient',
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
                            schema: getModelSchemaRef(Patient, {
                                title: 'CreatedPatient'
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
                    schema: getModelSchemaRef(Patient, {
                        title: 'UpdatePatient',
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
                    schema: getModelSchemaRef(Patient, {
                        title: 'PartialPatient',
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
                                items: getModelSchemaRef(Patient)
                            }
                        }
                    }
                }
            }
        }
    }
}
