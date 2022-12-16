import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError } from '../errors'
import { ServerError } from '../errors/serverError'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './signup-protocols'

const MakeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const MakeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

// const MakeEmailValidatorWithError = (): EmailValidator => {
//   class EmailValidatorStub implements EmailValidator {
//     isValid (email: string): boolean {
//       throw new Error()
//     }
//   }

//   return new EmailValidatorStub()
// }

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const MakeSut = (): SutTypes => {
  const emailValidatorStub = MakeEmailValidator()
  const addAccountStub = MakeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
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

    test('Should call AddAccount with correct values', () => {
      const { sut, addAccountStub } = MakeSut()
      const addSpy = jest.spyOn(addAccountStub, 'add')
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        }
      }
      sut.handle(httpRequest)
      expect(addSpy).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password'
      })
    })

    test('Should return 500 if AddAccount throws', () => {
      const { sut, addAccountStub } = MakeSut()
      jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
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
