import { InvalidParamError } from "../../errors"
import { EmailValidator } from "../../protocols"
import { Validation } from "../../protocols/validation"

export class EmailValidation implements Validation {
    constructor (private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

    validate (input: any): any {
        if (!this.emailValidator.isValid(input[this.fieldName])) {
          return new InvalidParamError(this.fieldName)
        }
    }
}
