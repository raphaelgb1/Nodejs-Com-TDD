import { MissingParamError } from "../../errors"
import { Validation } from "./validation"
import { ValidationComposite } from "./validation-composite"

describe('Validation Composite', () => {
    interface SutTypes {
        sut: ValidationComposite
    }

    const makeSut = (): SutTypes => {
        const validationStub = makeValidationStub()
        const sut = new ValidationComposite([validationStub])
        return {
            sut
        }
    }

    const makeValidationStub = (): Validation => {
        class ValidationStub implements Validation {
            validate (input: any): any {
                return new MissingParamError('field')
            }
        }
        return new ValidationStub()
    }

    const makeFakeRequest = (): any => ({
        field: 'any_value'
    })

    test('Should return an error if any validation fails', () => {
        const { sut } = makeSut()
        const error = sut.validate(makeFakeRequest())
        expect(error).toEqual(new MissingParamError('field'))
    })
})
