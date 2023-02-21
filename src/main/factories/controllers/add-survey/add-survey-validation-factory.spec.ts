import { Validation } from "../../../../presentation/protocols/validation"
import { RequiredFieldValidation, ValidationComposite } from "../../../../validation/validators"
import { makeAddSurveyValidation } from "./add-survey-validation-factory"

jest.mock("../../../../validation/validators/validation-composite")

describe('Add Survey Validation Factory', () => {
    test('Should call Validation Composite with all validations', () => {
        makeAddSurveyValidation()
        const validation: Validation[] = []
        const requiredFields = ['question', 'answers']
        for (const field of requiredFields) {
            validation.push(new RequiredFieldValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validation)
    })
})
