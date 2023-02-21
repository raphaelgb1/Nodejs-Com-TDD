import { Validation } from "../../../../presentation/protocols/validation"
import { RequiredFieldValidation, ValidationComposite } from "../../../../validation/validators"

export const makeAddSurveyValidation = (): Validation => {
    const validation: Validation[] = []
    const requiredFields = ['question', 'answers']
    for (const field of requiredFields) {
        validation.push(new RequiredFieldValidation(field))
    }
    return new ValidationComposite(validation)
}
