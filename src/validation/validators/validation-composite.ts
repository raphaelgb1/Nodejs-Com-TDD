import { JoiValidatorAdapter } from '../../infra/validators/joi-validator-adapter'
import { Validation } from '../../presentation/protocols'

export class ValidationComposite implements Validation {
    constructor (private readonly validations: Validation[], 
        private readonly joiValidation: JoiValidatorAdapter) {}

    validate (input: any): any {
        for (const validation of this.validations) {
            const error = validation.validate(input)
            const resultJoi = this.joiValidation.checkSchema(input)
            if (error || !resultJoi) {
                return error
            }
        }
    }
}
