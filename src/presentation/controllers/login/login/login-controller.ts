/* eslint-disable @typescript-eslint/return-await */
import { Authentication, AuthenticationParams } from "@/domain/useCases/account/authentication"
import { badRequest, responseOk, serverError, unauthorized } from "@/presentation/helper/http/httpHelper"
import { Controller, HttpRequest, Validation } from "../signup/signup-controller-protocols"

export class LoginController implements Controller {
    constructor (private readonly authentication: Authentication, private readonly validation: Validation) {}

    async handle (httpRequest: HttpRequest): Promise<any> {
        try {
            const { email, password } = httpRequest.body
            const auth: AuthenticationParams = { email, password }
            const accessToken = await this.authentication.auth(auth)
            const error = this.validation.validate(httpRequest.body)
            if (error) {
                return badRequest(error)
            }
            if (!accessToken) {
                return unauthorized()
            }

            return responseOk({ accessToken })
        } catch (error) {
            return serverError(error)
        }
    }
}
