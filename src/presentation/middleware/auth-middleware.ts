import { LoadAccountByToken } from "../../domain/useCases/load-account-by-token"
import { AccessDeniedError } from "../errors/access-denial-error"
import { forbbiden, responseOk, serverError } from "../helper/http/httpHelper"
import { Controller, HttpRequest, HttpResponse } from "../protocols"

export class AuthMiddleware implements Controller {
    constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const accessToken = httpRequest.headers?.['x-access-token']
            if (accessToken) {
                const account = await this.loadAccountByToken.load(accessToken)
                if (account) {
                    return responseOk({ account_id: account.id })
                }
            }
            return forbbiden(new AccessDeniedError())
        } catch (error) {
            return serverError(error)
        }
    }
}
