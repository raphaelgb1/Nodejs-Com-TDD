/* eslint-disable @typescript-eslint/return-await */
import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest } from "../../helper/httpHelper"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../signup-protocols"

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const param = httpRequest.body.email ? 'email' : 'password'
        const isValid = this.emailValidator.isValid(httpRequest.body?.email)
        if (!isValid) {
            return new Promise(resolve => resolve(badRequest(new InvalidParamError(param))))
        }
        return new Promise(resolve => resolve(badRequest(new MissingParamError(param))))
    }
}
