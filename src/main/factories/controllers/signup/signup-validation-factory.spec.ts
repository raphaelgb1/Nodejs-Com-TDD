import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from "../../../../presentation/helper/validators"
import { EmailValidator } from "../../../../presentation/protocols"
import { Validation } from "../../../../presentation/protocols/validation"
import { makeSignUpValidation } from "./signup-validation-factory"

jest.mock("../../../../presentation/helper/validators/validation-composite")

const MakeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }
    return new EmailValidatorStub()
  }

describe('SignUpValidation Factory', () => {
    test('Should call Validation Composite with all validations', () => {
        makeSignUpValidation()
        const validation: Validation[] = []
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
        for (const field of requiredFields) {
            validation.push(new RequiredFieldValidation(field))
        }
        validation.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
        validation.push(new EmailValidation('email', MakeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validation)
    })
})
