import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '../protocols/emailValidator'
import { EmailValidation } from './email-validation'

const MakeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const MakeSut = (): SutTypes => {
  const emailValidatorStub = MakeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const makeFakeEmail = (): any => ({ email: 'anyEmail@gmail.com' })

describe('Email Validation', () => {
    test('Should return 400 if email confirmation is invalid', () => {
      const { sut, emailValidatorStub } = MakeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const error = sut.validate(makeFakeEmail())
      expect(error).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidator with correct email', () => {
      const { sut, emailValidatorStub } = MakeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
      sut.validate(makeFakeEmail())
      expect(isValidSpy).toHaveBeenCalledWith('anyEmail@gmail.com')
    })

    test('Should return 500 if EmailValidator throws', () => {
      const { sut, emailValidatorStub } = MakeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      expect(sut.validate).toThrow()
    })
})
