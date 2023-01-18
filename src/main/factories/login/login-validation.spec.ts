import { EmailValidation } from "../../../presentation/helper/validators/email-validation"
import { RequiredFieldValidation } from "../../../presentation/helper/validators/required-field-validation"
import { Validation } from "../../../presentation/helper/validators/validation"
import { ValidationComposite } from "../../../presentation/helper/validators/validation-composite"
import { EmailValidator } from "../../../presentation/protocols"
import { makeLoginValidation } from "./login-validation"

jest.mock("../../../presentation/helper/validators/validation-composite")

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
        makeLoginValidation()
        const validation: Validation[] = []
        const requiredFields = ['email', 'password']
        for (const field of requiredFields) {
            validation.push(new RequiredFieldValidation(field))
        }
        validation.push(new EmailValidation('email', MakeEmailValidator()))
        expect(ValidationComposite).toHaveBeenCalledWith(validation)
    })
})
