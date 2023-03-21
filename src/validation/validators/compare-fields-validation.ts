import { InvalidParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

export class CompareFieldsValidation implements Validation {
    constructor (private readonly fieldName: string, private readonly fieldCompareName: string) {}

    validate (input: any): any {
        if (input[this.fieldName] !== input[this.fieldCompareName]) {
            return new InvalidParamError(this.fieldCompareName)
        }
    }
}
