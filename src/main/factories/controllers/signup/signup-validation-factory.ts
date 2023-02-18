import { Validation } from "../../../../presentation/protocols/validation"
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../validation/validators"
import { EmailValidatorAdapter } from "../../../adapters/validators/email-validator-adapter"

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
