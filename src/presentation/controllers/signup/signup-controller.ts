/* eslint-disable padded-blocks */
import { badRequest, responseOk, serverError } from '../../helper/http/httpHelper'
import { HttpRequest, Controller, AddAccount, HttpResponse, Validation } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return responseOk(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
