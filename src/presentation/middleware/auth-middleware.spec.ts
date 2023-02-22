import { AccountModel } from "../../domain/models/account"
import { LoadAccountByToken } from "../../domain/useCases/load-account-by-token"
import { AccessDeniedError } from "../errors/access-denial-error"
import { forbbiden } from "../helper/http/httpHelper"
import { HttpRequest } from "../protocols"
import { AuthMiddleware } from "./auth-middleware"

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load (accessToken: string, role?: string | undefined): Promise<AccountModel> {
            return await Promise.resolve(makeFakeAccount())
        }
    }
    return new LoadAccountByTokenStub()
}

const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    return {
        sut,
        loadAccountByTokenStub
    }
}

const makeFakeRequest = (): HttpRequest => ({
    headers: {
        'x-access-token': 'any_token'
    }
})

const makeFakeAccount = (): AccountModel => ({
    id: "string",
    name: "string",
    email: "string",
    password: "string"
})

describe('Auth Middleware Presentation', () => {
    test('Should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
    })

    test('Should call LoadAccountByToken with correct access-token', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers?.['x-access-token'])
    })

    test('Should return 403 if LoadAccountByToken returns null', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null as any))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
    })
})
