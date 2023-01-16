/* eslint-disable @typescript-eslint/return-await */
import { MissingParamError } from "../../errors"
import { badRequest } from "../../helper/httpHelper"
import { Controller, HttpRequest, HttpResponse } from "../signup-protocols"

export class LoginController implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
}
