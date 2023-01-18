import { EmailValidation } from "../../../presentation/helper/validators/email-validation"
import { RequiredFieldValidation } from "../../../presentation/helper/validators/required-field-validation"
import { Validation } from "../../../presentation/helper/validators/validation"
import { ValidationComposite } from "../../../presentation/helper/validators/validation-composite"
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter"

export const makeLoginValidation = (): Validation => {
    const validation: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
        validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validation)
}
