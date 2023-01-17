/* eslint-disable @typescript-eslint/return-await */
import { Authentication } from "../../../domain/useCases/authentication"
import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError } from "../../helper/httpHelper"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../signup-protocols"

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication

    constructor (emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { email, password } = httpRequest.body
            const param = email ? 'email' : 'password'
            if (!this.emailValidator.isValid(email)) {
                return new Promise(resolve => resolve(badRequest(new InvalidParamError(param))))
            }
            await this.authentication.auth(email, password)
            return new Promise(resolve => resolve(badRequest(new MissingParamError(param))))
        } catch (error) {
            return serverError(error)
        }
    }
}
