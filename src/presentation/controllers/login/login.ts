/* eslint-disable @typescript-eslint/return-await */
import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, serverError } from "../../helper/httpHelper"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../signup-protocols"

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { email } = httpRequest.body
            const param = email ? 'email' : 'password'
            if (!this.emailValidator.isValid(email)) {
                return new Promise(resolve => resolve(badRequest(new InvalidParamError(param))))
            }
            return new Promise(resolve => resolve(badRequest(new MissingParamError(param))))
        } catch (error) {
            return serverError(error)
        }
    }
}
