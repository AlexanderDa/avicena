import { getModelSchemaRef } from '@loopback/rest'
import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { User } from '../../models'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'
import { Spect } from './stect'

export class UserSpect extends Spect {
    create(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(User, {
                        title: 'NewUser',
                        exclude: [
                            'createdBy',
                            'createdAt',
                            'id',
                            'isActive',
                            'password',
                            'passwordResetToken',
                            'passwordResetTokenDate',
                            'image'
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
                    description: 'User model instance',
                    content: {
                        'application/json': {
                            schema: getModelSchemaRef(User, {
                                title: 'CreatedUser',
                                exclude: [
                                    'password',
                                    'passwordResetToken',
                                    'passwordResetTokenDate'
                                ]
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
                    schema: getModelSchemaRef(User, {
                        title: 'UpdateUser',
                        exclude: [
                            'createdBy',
                            'createdAt',
                            'password',
                            'passwordResetToken',
                            'passwordResetTokenDate'
                        ]
                    })
                }
            }
        }
    }

    partial(): RequestBodyObject {
        return {
            content: {
                'application/json': {
                    schema: getModelSchemaRef(User, {
                        title: 'PartialUser',
                        partial: true,
                        exclude: [
                            'createdBy',
                            'createdAt',
                            'password',
                            'passwordResetToken',
                            'passwordResetTokenDate'
                        ]
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
                    description: 'Array of User model instances',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: getModelSchemaRef(User)
                            }
                        }
                    }
                }
            }
        }
    }
}
