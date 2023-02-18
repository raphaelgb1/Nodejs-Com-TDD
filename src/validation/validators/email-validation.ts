import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'
import { EmailValidator } from '../protocols/emailValidator'

export class EmailValidation implements Validation {
    constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

    validate (input: any): any {
        if (!this.emailValidator.isValid(input[this.fieldName])) {
          return new InvalidParamError(this.fieldName)
        }
    }
}
