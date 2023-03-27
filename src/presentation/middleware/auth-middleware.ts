import { AccessDeniedError } from "../errors/access-denial-error"
import { forbbiden, responseOk, serverError } from "../helper/http/httpHelper"
import { Controller, HttpRequest, HttpResponse, LoadAccountByToken } from "./auth-middleware.protocols"

export class AuthMiddleware implements Controller {
    constructor (
            private readonly loadAccountByToken: LoadAccountByToken,
            private readonly role?: string
        ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const accessToken = httpRequest.headers?.['x-access-token']
            if (accessToken) {
                const account = await this.loadAccountByToken.load(accessToken, this.role)
                if (account) {
                    return responseOk({ accountId: account.id })
                }
            }
            return forbbiden(new AccessDeniedError())
        } catch (error) {
            return serverError(error)
        }
    }
}
