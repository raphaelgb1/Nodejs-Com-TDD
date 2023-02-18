
import { InvalidParamError, MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'
import { ValidationComposite } from "./validation-composite"

describe('Validation Composite', () => {
    interface SutTypes {
        sut: ValidationComposite
        validationStubs: Validation[]
    }

    const makeSut = (): SutTypes => {
        const validationStubs = [makeValidationStub(), makeValidationStub()]
        const sut = new ValidationComposite(validationStubs)
        return {
            sut,
            validationStubs
        }
    }

    const makeValidationStub = (): Validation => {
        class ValidationStub implements Validation {
            validate (input: any): any {
                return null
            }
        }
        return new ValidationStub()
    }

    const makeFakeRequest = (): any => ({
        field: 'any_value'
    })

    test('Should return an error if any validation fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
        const error = sut.validate(makeFakeRequest())
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('Should return the first error if one validation fails', () => {
        const { sut, validationStubs } = makeSut()
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new InvalidParamError('field'))
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
        const error = sut.validate(makeFakeRequest())
        expect(error).toEqual(new InvalidParamError('field'))
    })

    test('Should not return if validation succeeds', () => {
        const { sut } = makeSut()
        const error = sut.validate(makeFakeRequest())
        expect(error).toBeFalsy()
    })
})
