/* eslint-disable @typescript-eslint/return-await */
import { Authentication } from "../../../domain/useCases/authentication"
import { badRequest, responseOk, serverError, unauthorized } from "../../helper/httpHelper"
import { Controller, HttpRequest, Validation } from "../signup/signup-protocols"

export class LoginController implements Controller {
    private readonly validation: Validation
    private readonly authentication: Authentication

    constructor (authentication: Authentication, validation: Validation) {
        this.validation = validation
        this.authentication = authentication
    }

    async handle (httpRequest: HttpRequest): Promise<any> {
        try {
            const { email, password } = httpRequest.body
            const accessToken = await this.authentication.auth(email, password)
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
