import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

type SutTypes = {
  sut: CompareFieldsValidation
}

const MakeSut = (): SutTypes => {
  const sut = new CompareFieldsValidation('field', 'fieldCompare')
  return {
    sut
  }
}

const makeFakeEmail = (type: boolean = false): any => {
    return type
    ? {
      field: 'anyEmail@gmail.com',
       fieldCompare: 'wrongEmail@gmail.com'
    }
    : {
      field: 'anyEmail@gmail.com',
       fieldCompare: 'anyEmail@gmail.com'
    }
}

describe('Compare Fields Validation', () => {
    test('Should return a Invalid Param Error if Validation fails', () => {
      const { sut } = MakeSut()
      const error = sut.validate(makeFakeEmail(true))
      expect(error).toEqual(new InvalidParamError('fieldCompare'))
    })

    test('Should not return if validation succeeds', () => {
      const { sut } = MakeSut()
      const error = sut.validate(makeFakeEmail())
      expect(error).toBeFalsy()
    })
})
