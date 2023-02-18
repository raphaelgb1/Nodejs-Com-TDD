/* eslint-disable padded-blocks */
import { EmailInUseError } from '../../errors'
import { badRequest, forbbiden, responseOk, serverError } from '../../helper/http/httpHelper'
import { Authentication } from '../login/login-controller-protocols'
import { HttpRequest, Controller, AddAccount, HttpResponse, Validation } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
      private readonly addAccount: AddAccount
    , private readonly validation: Validation
    , private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
      const addAccount = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!addAccount) {
        return forbbiden(new EmailInUseError())
      }

      const accessToken = await this.authentication.auth({ email, password })
      return responseOk({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
