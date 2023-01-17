/* eslint-disable @typescript-eslint/return-await */
import { MissingParamError } from "../../errors"
import { badRequest } from "../../helper/httpHelper"
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../signup-protocols"

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        this.emailValidator.isValid(httpRequest.body?.email)
        const param = httpRequest.body.email ? 'email' : 'password'
        return new Promise(resolve => resolve(badRequest(new MissingParamError(param))))
    }
}
