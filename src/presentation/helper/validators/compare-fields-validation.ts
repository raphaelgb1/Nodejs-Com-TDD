import { InvalidParamError } from "../../errors"
import { Validation } from "../../protocols/validation"

export class CompareFieldsValidation implements Validation {
    constructor (private readonly fieldName: string, private readonly fieldCompareName: string) {}

    validate (input: any): any {
        if (input[this.fieldName] !== input[this.fieldCompareName]) {
            return new InvalidParamError(this.fieldCompareName)
        }
    }
}
