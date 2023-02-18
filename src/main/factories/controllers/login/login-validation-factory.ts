import { Validation } from "../../../../presentation/protocols/validation"
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../validation/validators"
import { EmailValidatorAdapter } from "../../../adapters/validators/email-validator-adapter"

export const makeLoginValidation = (): Validation => {
    const validation: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
        validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validation)
}
