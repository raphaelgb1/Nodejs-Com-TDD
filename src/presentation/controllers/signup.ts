import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helper/httpHelper'
import { HttpRequest } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: HttpRequest): any {
    const requiredFields = ['name', 'email']
    for (const element of requiredFields) {
      if (!httpRequest.body[element]) {
        return badRequest(new MissingParamError(element))
      }
    }
  }
}
