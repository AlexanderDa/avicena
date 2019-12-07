import { inject } from '@loopback/context'
import { FindRoute } from '@loopback/rest'
import { InvokeMethod } from '@loopback/rest'
import { ParseParams } from '@loopback/rest'
import { Reject } from '@loopback/rest'
import { RequestContext } from '@loopback/rest'
import { RestBindings } from '@loopback/rest'
import { Send } from '@loopback/rest'
import { SequenceHandler } from '@loopback/rest'
import { AuthenticationBindings } from '@loopback/authentication'
import { AuthenticateFn } from '@loopback/authentication'
import { AUTHENTICATION_STRATEGY_NOT_FOUND } from '@loopback/authentication'
import { USER_PROFILE_NOT_FOUND } from '@loopback/authentication'

const SequenceActions = RestBindings.SequenceActions

export class MySequence implements SequenceHandler {
    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS)
        protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) protected send: Send,
        @inject(SequenceActions.REJECT) protected reject: Reject,
        @inject(AuthenticationBindings.AUTH_ACTION)
        protected authenticateRequest: AuthenticateFn
    ) {}

    async handle(context: RequestContext) {
        try {
            const { request, response } = context
            const route = this.findRoute(request)

            //call authentication action
            await this.authenticateRequest(request)

            // Authentication successful, proceed to invoke controller
            const args = await this.parseParams(request, route)
            const result = await this.invoke(route, args)
            this.send(response, result)
        } catch (error) {
            console.log(error)
            if (
                error.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
                error.code === USER_PROFILE_NOT_FOUND
            ) {
                Object.assign(error, { statusCode: 401 /* Unauthorized */ })
            }

            this.reject(context, error)
            return
        }
    }
}
