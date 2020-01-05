import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { OPERATION_SECURITY_SPEC } from '../../utils/security.spec'

export default class FileSpects {
    created(): OperationObject {
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

    create(): RequestBodyObject {
        return {
            description: 'Upload file',
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
