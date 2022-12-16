/* eslint-disable padded-blocks */
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helper/httpHelper'
import { HttpRequest, EmailValidator, Controller, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {

  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): any {

    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const element of requiredFields) {
        if (!httpRequest.body[element]) {
          return badRequest(new MissingParamError(element))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const invalid = this.emailValidator.isValid(email)
      if (!invalid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })

    } catch (err) {
      return serverError()
    }
  }
}
