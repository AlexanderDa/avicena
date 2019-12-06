import { inject } from '@loopback/context'
import { FindRoute } from '@loopback/rest'
import { InvokeMethod } from '@loopback/rest'
import { ParseParams } from '@loopback/rest'
import { Reject } from '@loopback/rest'
import { RequestContext } from '@loopback/rest'
import { RestBindings } from '@loopback/rest'
import { Send } from '@loopback/rest'
import { SequenceHandler } from '@loopback/rest'

const SequenceActions = RestBindings.SequenceActions

export class MySequence implements SequenceHandler {
    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS)
        protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject
    ) {}

    async handle(context: RequestContext) {
        try {
            const { request, response } = context
            const route = this.findRoute(request)
            const args = await this.parseParams(request, route)
            const result = await this.invoke(route, args)
            this.send(response, result)
        } catch (err) {
            this.reject(context, err)
        }
    }
}
