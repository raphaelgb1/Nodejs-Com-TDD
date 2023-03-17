import Joi from "joi"
import { EmailValidatorAdapter } from "../../../../../infra/validators/email-validator-adapter"
import { JoiValidatorAdapter } from "../../../../../infra/validators/joi-validator-adapter"
import { Validation } from "../../../../../presentation/protocols/validation"
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../../validation/validators"

export const makeSignUpValidation = (): Validation => {
    const validation: Validation[] = []
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const joiRequiredModel = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().alphanum().email().min(10).max(35).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        passwordConfirmation: Joi.ref('password')
    })
    for (const field of requiredFields) {
        validation.push(new RequiredFieldValidation(field))
    }
    validation.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validation.push(new EmailValidation('email', new EmailValidatorAdapter()))
    return new ValidationComposite(validation, new JoiValidatorAdapter(joiRequiredModel))
}
