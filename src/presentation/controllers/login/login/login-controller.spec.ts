import { MissingParamError } from "@/presentation/errors"
import { badRequest, responseOk, serverError, unauthorized } from "@/presentation/helper/http/httpHelper"
import { LoginController } from "./login-controller"
import { Authentication, AuthenticationModel, Validation } from './login-controller-protocols'

type SutTypes = {
    sut: LoginController
    authenticationStub: Authentication
    validationStub: Validation
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth (authentication: AuthenticationModel): Promise<string> {
            return await new Promise(resolve => resolve('any_token'))
        }
    }

    return new AuthenticationStub()
}

const MakeValidation = (): Validation => {
    class ValidationStub implements Validation {
      validate (input: any): any {
        return null
      }
    }
    return new ValidationStub()
  }

const makeSut = (): SutTypes => {
    const authenticationStub = makeAuthentication()
    const validationStub = MakeValidation()
    const sut = new LoginController(authenticationStub, validationStub)
    return {
        sut,
        validationStub,
        authenticationStub
    }
}

const makeFakeRequest = (type: number = 0): any => {
    const email = 'any_email@gmail.com'
    const password = 'any_password'
    if (type === 0) {
        return { body: { email } }
    } else if (type === 1) {
        return { body: { password } }
    } else if (type === 2) {
        return { body: { email, password } }
    } else {
        return { email, password }
    }
}

describe('Login Controller', () => {
    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest(2))
        expect(authSpy).toHaveBeenCalledWith(makeFakeRequest(3))
    })

    test('Should return 401 if an invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))
        const httpResponse = await sut.handle(makeFakeRequest(2))
        expect(httpResponse).toEqual(unauthorized())
    })

    test('Should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest(2))
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest(2))
        expect(httpResponse).toEqual(responseOk({ accessToken: 'any_token' }))
    })

    test('Should call Validation with correct value', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
      })

      test('Should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
      })
 })
