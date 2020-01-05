import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'

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
}
