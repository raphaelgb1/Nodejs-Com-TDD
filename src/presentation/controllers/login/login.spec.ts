import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest } from "../../helper/httpHelper"
import { EmailValidator, HttpResponse } from "../signup-protocols"
import { LoginController } from "./login"

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new LoginController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

const makeRequest = (type: number): any => {
    const email = 'any_email@gmail.com'
    const password = 'any_email@gmail.com'
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
        const httpRequest = makeRequest(0)

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(makeBadRequest(true, 'email'))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeRequest(1)

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(makeBadRequest(true, 'password'))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = makeRequest(2)

        await sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
    })

    test('Should return 400 if invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = makeRequest(2)

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(makeBadRequest(false, 'email'))
    })
})
