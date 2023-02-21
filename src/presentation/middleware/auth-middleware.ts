import { AccessDeniedError } from "../errors/access-denial-error"
import { forbbiden } from "../helper/http/httpHelper"
import { Controller, HttpRequest } from "../protocols"

export class AuthMiddleware implements Controller {
    async handle (httpRequest: HttpRequest): Promise<any> {
        if (!httpRequest.headers) {
            return forbbiden(new AccessDeniedError())
        }
    }
}
