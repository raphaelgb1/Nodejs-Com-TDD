import { EmailValidatorAdapter } from "@/infra/validators/email-validator-adapter"
import { Validation } from "@/presentation/protocols/validation"
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "@/validation/validators"

export const makeLoginValidation = (): Validation => {
    const validation: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
        validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validation)
}
