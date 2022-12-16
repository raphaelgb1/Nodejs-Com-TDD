import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError } from '../errors'
import { EmailValidator } from '../protocols/emailValidator'
import { ServerError } from '../errors/serverError'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const MakeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

// const MakeEmailValidatorWithError = (): EmailValidator => {
//   class EmailValidatorStub implements EmailValidator {
//     isValid (email: string): boolean {
//       throw new Error()
//     }
//   }

//   return new EmailValidatorStub()
// }
const MakeSut = (): SutTypes => {
  const emailValidatorStub = MakeEmailValidator()
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

    test('Should return 400 if no password confirmation fails', () => {
      const { sut } = MakeSut()
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'anyEmail@gmail.com',
          password: 'any_password',
          passwordConfirmation: 'invalid_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
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
    test('Should return 500 if EmailValidator throws', () => {
      const { sut, emailValidatorStub } = MakeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })
})
