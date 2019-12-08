import { OperationObject } from 'openapi3-ts'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'
import { CountSchema } from '@loopback/repository'

export class Spect {
    simple(description?: string): OperationObject {
        return {
            security: OPERATION_SECURITY_SPEC,
            responses: {
                '204': {
                    description: description
                }
            }
        }
    }

    count(description?: string): OperationObject {
        return {
            security: OPERATION_SECURITY_SPEC,
            responses: {
                '200': {
                    description: description,
                    content: {
                        'application/json': {
                            schema: CountSchema
                        }
                    }
                }
            }
        }
    }

    updated(description?: string): OperationObject {
        return {
            security: OPERATION_SECURITY_SPEC,
            responses: {
                '200': {
                    description: description,
                    content: { 'application/json': { schema: CountSchema } }
                }
            }
        }
    }
}
