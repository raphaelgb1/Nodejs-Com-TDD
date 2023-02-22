import { LoadAccountByToken } from "../../domain/useCases/load-account-by-token"
import { AccessDeniedError } from "../errors/access-denial-error"
import { forbbiden } from "../helper/http/httpHelper"
import { Controller, HttpRequest, HttpResponse } from "../protocols"

export class AuthMiddleware implements Controller {
    constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse | any> {
        const accessToken = httpRequest.headers?.['x-access-token']
        if (accessToken) {
            await this.loadAccountByToken.load(accessToken)
        }
        return forbbiden(new AccessDeniedError())
    }
}
