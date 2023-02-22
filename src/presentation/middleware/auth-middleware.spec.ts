import { AccountModel } from "../../domain/models/account"
import { AccessDeniedError } from "../errors/access-denial-error"
import { forbbiden, responseOk, serverError } from "../helper/http/httpHelper"
import { AuthMiddleware } from "./auth-middleware"
import { HttpRequest, LoadAccountByToken } from './auth-middleware.protocols'

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

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub, role)
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
    id: "valid_id",
    name: "valid-name",
    email: "valid_email@gmail.com",
    password: "valid_password"
})

const role = 'any_role'

describe('Auth Middleware Presentation', () => {
    test('Should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
    })

    test('Should call LoadAccountByToken with correct access-token', async () => {
        const { sut, loadAccountByTokenStub } = makeSut(role)
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers?.['x-access-token'], role)
    })

    test('Should return 403 if LoadAccountByToken returns null', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null as any))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
    })

    test('Should return 200 if LoadAccountByToken returns an account', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(responseOk({ account_id: makeFakeAccount().id }))
    })

    test('Should return 500 if LoadAccountByToken throws', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
