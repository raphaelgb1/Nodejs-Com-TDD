import { AccessDeniedError } from "../errors/access-denial-error"
import { forbbiden } from "../helper/http/httpHelper"
import { HttpRequest } from "../protocols"
import { AuthMiddleware } from "./auth-middleware"

interface SutTypes {
    sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
    const sut = new AuthMiddleware()
    return {
        sut
    }
}

const makeFakeRequest = (): HttpRequest => ({
    headers: {

    }
})

describe('Auth Middleware Presentation', () => {
    test('Should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest.headers)
        expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
    })
})
