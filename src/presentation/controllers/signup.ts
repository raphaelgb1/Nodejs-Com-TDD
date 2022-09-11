import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helper/httpHelper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/emailValidator'
import { HttpRequest } from '../protocols/http'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): any {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const element of requiredFields) {
        if (!httpRequest.body[element]) {
          return badRequest(new MissingParamError(element))
        }
      }
      const invalid = this.emailValidator.isValid(httpRequest.body.email)
      if (!invalid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (err) {
      return serverError()
    }
  }
}
