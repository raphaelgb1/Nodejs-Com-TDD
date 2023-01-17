import { RequiredFieldValidation } from "../../presentation/helper/validators/required-field-validation"
import { Validation } from "../../presentation/helper/validators/validation"
import { ValidationComposite } from "../../presentation/helper/validators/validation-composite"

export const makeSignUpValidation = (): Validation => {
    const validation: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
        validation.push(new RequiredFieldValidation(field))
    }
    return new ValidationComposite(validation)
}
