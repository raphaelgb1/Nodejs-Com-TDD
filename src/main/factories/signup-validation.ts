import { RequiredFieldValidation } from "../../presentation/helper/validators/required-field-validation"
import { Validation } from "../../presentation/helper/validators/validation"
import { ValidationComposite } from "../../presentation/helper/validators/validation-composite"

export const makeSignUpValidation = (): Validation => {
    const validation: Validation[] = []
    for (const field of ['name', 'email']) {
        validation.push(new RequiredFieldValidation(field))
    }
    return new ValidationComposite(validation)
}
