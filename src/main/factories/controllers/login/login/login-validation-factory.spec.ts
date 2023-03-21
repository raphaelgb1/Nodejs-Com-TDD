import { EmailValidator } from "@/presentation/protocols"
import { Validation } from "@/presentation/protocols/validation"
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from "@/validation/validators"
import { makeLoginValidation } from "./login-validation-factory"

jest.mock("../../../../../validation/validators/validation-composite")

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
