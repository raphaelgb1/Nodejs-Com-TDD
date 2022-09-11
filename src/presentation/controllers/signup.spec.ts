import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missingParamError'
import { InvalidParamError } from '../errors/invalidParamError'
import { EmailValidator } from '../protocols/emailValidator'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const MakeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provide', () => {
    const { sut } = MakeSut()
    const httpRequest = {
      body: {
        email: 'anyEmail@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

    test('Should return 400 if no email is provide', () => {
      const { sut } = MakeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provide', () => {
      const { sut } = MakeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'anyEmail@gmail.com',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no password confirmation is provide', () => {
      const { sut } = MakeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'anyEmail@gmail.com',
          password: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if email confirmation is invalid', () => {
      const { sut, emailValidatorStub } = MakeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'invalid_email@gmail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
    test('Should call EmailValidator with correct email', () => {
      const { sut, emailValidatorStub } = MakeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'invalid_email@gmail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('invalid_email@gmail.com')
    })
})
