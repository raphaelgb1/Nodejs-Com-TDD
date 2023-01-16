import { MissingParamError } from "../../errors"
import { badRequest } from "../../helper/httpHelper"
import { HttpResponse } from "../signup-protocols"
import { LoginController } from "./login"

const makeSut = (): LoginController => {
    return new LoginController()
}

const makeFakeRequest = (): any => ({
    body: {
        password: 'any_password'
    }
})

const makeBadRequestMiss = (typeError: string): HttpResponse => {
    return badRequest(new MissingParamError(typeError))
}

describe('Login Controller', () => {
    test('Should return 400 if no email is provided', async () => {
        const sut = makeSut()
        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(makeBadRequestMiss('email'))
    })
})
