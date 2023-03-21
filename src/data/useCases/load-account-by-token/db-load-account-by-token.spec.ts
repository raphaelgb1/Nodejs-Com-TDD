import { Decrypter, LoadAccountByTokenRepository, AccountModel } from "./db-load-account-by-token-protocols"
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        async decrypt (value: string): Promise<string> {
            return await Promise.resolve('any_value')
        }
    }
    return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
        async loadByToken (token: string, role?: string): Promise<AccountModel> {
            return await Promise.resolve(makeFakeAccount())
        }
    }
    return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
    return {
        sut,
        decrypterStub,
        loadAccountByTokenRepositoryStub
    }
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@gmail.com',
    password: 'valid_password'
  })

const role = 'any_role'

describe('Db Load Account by Token UseCase', () => {
    test('Should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut()
        const loadSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token')
        expect(loadSpy).toHaveBeenCalledWith('any_token')
    })

    test('Should return null if Decrypter returns null', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null as any))
        const httpResponse = await sut.load('any_token')
        expect(httpResponse).toBeNull()
    })

    test('Should call Load by Account by Token Repository with correct values', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null as any))
        await sut.load('any_token', role)
        expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', role)
    })

    test('Should return null if Load by Account by Token Repository returns null', async () => {
        const { sut, loadAccountByTokenRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null as any))
        const httpResponse = await sut.load('any_token', role)
        expect(httpResponse).toBeNull()
    })

    test('Should return an Account on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.load('any_token', role)
        expect(httpResponse).toEqual(makeFakeAccount())
    })

    // test('Should return null if Load by Account by Token Repository returns null', async () => {
    //     const { sut, decrypterStub } = makeSut()
    //     jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    //     const promise = await sut.load('any_token', role)
    //     expect(promise).toThrow()
    // })
})
