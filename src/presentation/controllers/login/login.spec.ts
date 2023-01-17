import { MissingParamError } from "../../errors"
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
    if (type === 0) {
        return { body: { email: 'any_email@gmail.com' } }
    } else if (type === 1) {
        return { body: { password: 'any_password' } }
    } else {
        return { body: { email: 'any_email@gmail.com', password: 'any_password' } }
    }
}

const makeBadRequestMiss = (typeError: string): HttpResponse => {
    return badRequest(new MissingParamError(typeError))
}

describe('Login Controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeRequest(0)

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(makeBadRequestMiss('email'))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeRequest(1)

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(makeBadRequestMiss('password'))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = makeRequest(2)

        await sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
    })
})
