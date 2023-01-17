/* eslint-disable padded-blocks */
import { InvalidParamError } from '../../errors'
import { badRequest, responseOk, serverError } from '../../helper/httpHelper'
import { HttpRequest, EmailValidator, Controller, AddAccount, HttpResponse, Validation } from './signup-protocols'

export class SignUpController implements Controller {

  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      // const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      // for (const element of requiredFields) {
      //   if (!httpRequest.body[element]) {
      //     return badRequest(new MissingParamError(element))
      //   }
      // }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const invalid = this.emailValidator.isValid(email)
      if (!invalid) {
        return badRequest(new InvalidParamError('email'))
      }

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
