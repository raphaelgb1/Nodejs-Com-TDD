import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helper/httpHelper'
import { HttpRequest } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): any {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
