import { LoadAccountByToken } from "../../domain/useCases/load-account-by-token"
import { AccessDeniedError } from "../errors/access-denial-error"
import { forbbiden, responseOk } from "../helper/http/httpHelper"
import { Controller, HttpRequest, HttpResponse } from "../protocols"

export class AuthMiddleware implements Controller {
    constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const accessToken = httpRequest.headers?.['x-access-token']
        if (accessToken) {
            const account = await this.loadAccountByToken.load(accessToken)
            if (account) {
                return responseOk(account.id)
            }
        }
        return forbbiden(new AccessDeniedError())
    }
}
