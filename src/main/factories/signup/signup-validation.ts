import { CompareFieldsValidation } from "../../../presentation/helper/validators/compare-fields-validation"
import { EmailValidation } from "../../../presentation/helper/validators/email-validation"
import { RequiredFieldValidation } from "../../../presentation/helper/validators/required-field-validation"
import { Validation } from "../../../presentation/helper/validators/validation"
import { ValidationComposite } from "../../../presentation/helper/validators/validation-composite"
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter"

export const makeSignUpValidation = (): Validation => {
    const validation: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
        validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validation)
}
