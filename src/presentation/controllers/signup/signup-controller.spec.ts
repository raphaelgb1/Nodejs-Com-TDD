import { SignUpController } from './signup-controller'
import { MissingParamError } from '../../errors'
import { ServerError } from '../../errors/serverError'
import { AccountModel, AddAccount, AddAccountModel, HttpRequest, Validation } from './signup-controller-protocols'
import { responseOk, serverError, badRequest } from '../../helper/http/httpHelper'
import { Authentication, AuthenticationModel } from '../login/login-controller-protocols'

const MakeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const MakeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): any {
      return null
    }
  }
  return new ValidationStub()
}

const MakeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
      async auth (authentication: AuthenticationModel): Promise<string> {
          return await new Promise(resolve => resolve('any_token'))
      }
  }

  return new AuthenticationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const MakeSut = (): SutTypes => {
  const addAccountStub = MakeAddAccount()
  const validationStub = MakeValidation()
  const authenticationStub = MakeAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
    body: {
      name: 'any_name',
      email: 'anyEmail@gmail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
})

const makeFakeAuth = (): AuthenticationModel => ({
    email: 'anyEmail@gmail.com',
    password: 'any_password'
})
describe('SignUp Controller', () => {
    test('Should call AddAccount with correct values', async () => {
      const { sut, addAccountStub } = MakeSut()
      const addSpy = jest.spyOn(addAccountStub, 'add')
      const httpRequest = makeFakeRequest()
      await sut.handle(httpRequest)
      expect(addSpy).toHaveBeenCalledWith({
        name: 'any_name',
        email: 'anyEmail@gmail.com',
        password: 'any_password'
      })
    })

    test('Should return 500 if AddAccount throws', async () => {
      const { sut, addAccountStub } = MakeSut()
      jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(new Error()))
      })
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError()))
    })

    test('Should return 200 if valid data is provide', async () => {
      const { sut } = MakeSut()
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(responseOk(makeFakeAccount()))
    })

    test('Should call Validation with correct value', async () => {
      const { sut, validationStub } = MakeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      const httpRequest = makeFakeRequest()
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('Should return 400 if Validation returns an error', async () => {
      const { sut, validationStub } = MakeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })

    test('Should call Authentication with correct values', async () => {
      const { sut, authenticationStub } = MakeSut()
      const authSpy = jest.spyOn(authenticationStub, 'auth')
      await sut.handle(makeFakeRequest())
      expect(authSpy).toHaveBeenCalledWith(makeFakeAuth())
  })
})
