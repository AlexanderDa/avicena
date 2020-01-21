import { getModelSchemaRef } from '@loopback/rest'
import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { Doctor } from '../../models'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'
import { Spect } from './stect'

export class DoctorSpect extends Spect {
    create(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Doctor, {
                        title: 'NewDoctor',
                        exclude: [
                            'createdBy',
                            'createdAt',
                            'id',
                            'lastName',
                            'firstName',
                            'passport',
                            'dni',
                            'telephone',
                            'mobile',
                            'emailAddress',
                            'regProfessional',
                            'address'
                        ]
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
                            schema: getModelSchemaRef(Doctor, {
                                title: 'CreatedDoctor'
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
                    schema: getModelSchemaRef(Doctor, {
                        title: 'UpdateDoctor',
                        exclude: [
                            'createdBy', 
                            'createdAt', 
                            'lastName',
                            'firstName',
                            'passport',
                            'dni',
                            'telephone',
                            'mobile',
                            'emailAddress',
                            'regProfessional',
                            'address']
                    })
                }
            }
        }
    }

    partial(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Doctor, {
                        title: 'PartialDoctor',
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
                                items: getModelSchemaRef(Doctor)
                            }
                        }
                    }
                }
            }
        }
    }
}
