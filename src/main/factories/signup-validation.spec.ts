import { RequiredFieldValidation } from "../../presentation/helper/validators/required-field-validation"
import { Validation } from "../../presentation/helper/validators/validation"
import { ValidationComposite } from "../../presentation/helper/validators/validation-composite"
import { makeSignUpValidation } from "./signup-validation"

jest.mock("../../presentation/helper/validators/validation-composite")

describe('SignUpValidation Factory', () => {
    test('Should call Validation Composite with all validations', () => {
        const validation: Validation[] = []
        for (const field of ['name', 'email']) {
            validation.push(new RequiredFieldValidation(field))
        }
        makeSignUpValidation()
        expect(ValidationComposite).toHaveBeenCalledWith(validation)
    })
})
