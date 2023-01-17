/* eslint-disable @typescript-eslint/return-await */
import { Authentication } from "../../../domain/useCases/authentication"
import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, responseOk, serverError, unauthorized } from "../../helper/httpHelper"
import { Controller, EmailValidator, HttpRequest } from "../signup-protocols"

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication

    constructor (emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

    async handle (httpRequest: HttpRequest): Promise<any> {
        try {
            const { email, password } = httpRequest.body
            const param = email ? 'email' : 'password'
            const accessToken = await this.authentication.auth(email, password)

            if (!this.emailValidator.isValid(email)) {
                return badRequest(new InvalidParamError(param))
            }

            if (!email || !password) {
                return badRequest(new MissingParamError(param))
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
