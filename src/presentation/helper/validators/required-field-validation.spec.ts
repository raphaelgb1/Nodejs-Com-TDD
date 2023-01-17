import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

interface SutTypes {
  sut: RequiredFieldValidation
}

const MakeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('field')
  return {
    sut
  }
}

const makeFakeEmail = (type: boolean = false): any => {
    return type ? { email: 'anyEmail@gmail.com' } : { field: 'anyEmail@gmail.com' }
}

describe('Required Field Validation', () => {
    test('Should return a Missing Param Error if Validation fails', () => {
      const { sut } = MakeSut()
      const error = sut.validate(makeFakeEmail(true))
      expect(error).toEqual(new MissingParamError('field'))
    })

    test('Should not return if validation succeeds', () => {
      const { sut } = MakeSut()
      const error = sut.validate(makeFakeEmail())
      expect(error).toBeFalsy()
    })
})
