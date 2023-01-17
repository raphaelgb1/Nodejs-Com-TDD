import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, responseOk, serverError, unauthorized } from "../../helper/httpHelper"
import { LoginController } from "./login"
import { Authentication, HttpResponse, EmailValidator } from './login-protocols'

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth (email: string, password: string): Promise<string> {
            return await new Promise(resolve => resolve('any_token'))
        }
    }

    return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(emailValidatorStub, authenticationStub)
    return {
        sut,
        emailValidatorStub,
        authenticationStub
    }
}

const makeFakeRequest = (type: number): any => {
    const email = 'any_email@gmail.com'
    const password = 'any_password'
    if (type === 0) {
        return { body: { email } }
    } else if (type === 1) {
        return { body: { password } }
    } else {
        return { body: { email, password } }
    }
}

const makeBadRequest = (type: boolean, error: string): HttpResponse => {
    return type ? badRequest(new MissingParamError(error)) : badRequest(new InvalidParamError(error))
}

describe('Login Controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest(0))
        expect(httpResponse).toEqual(makeBadRequest(true, 'email'))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest(1))
        expect(httpResponse).toEqual(makeBadRequest(true, 'password'))
    })

    test('Should call Email Validator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        await sut.handle(makeFakeRequest(2))
        expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
    })

    test('Should return 400 if invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpResponse = await sut.handle(makeFakeRequest(2))
        expect(httpResponse).toEqual(makeBadRequest(false, 'email'))
    })

    test('Should return 500 if Email Validator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })
        const httpResponse = await sut.handle(makeFakeRequest(2))
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')
        await sut.handle(makeFakeRequest(2))
        expect(authSpy).toHaveBeenCalledWith('any_email@gmail.com', 'any_password')
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
})
