import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'

export default class AccountSpects {
    logged(): OperationObject {
        return {
            responses: {
                '200': {
                    description: 'Token',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    login(): RequestBodyObject {
        return {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'password'],
                        properties: {
                            email: {
                                type: 'string',
                                format: 'email'
                            },
                            password: {
                                type: 'string',
                                minLength: 8
                            }
                        }
                    }
                }
            }
        }
    }

    changePass(): RequestBodyObject {
        return {
            description: 'Change the password of a logged in user',
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['password'],
                        properties: {
                            password: {
                                type: 'string',
                                minLength: 8
                            }
                        }
                    }
                }
            }
        }
    }

    newAvatar(): OperationObject {
        return {
            security: OPERATION_SECURITY_SPEC,
            responses: {
                200: {
                    content: {
                        'application/json': {
                            schema: {
                                properties: {
                                    url: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    newFile(): RequestBodyObject {
        return {
            description: 'User avatar.',
            required: true,
            content: {
                'multipart/form-data': {
                    // Skip body parsing
                    'x-parser': 'stream'
                }
            }
        }
    }
}
