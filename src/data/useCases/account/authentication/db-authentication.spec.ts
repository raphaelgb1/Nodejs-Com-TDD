/* eslint-disable comma-style */
import { mockAccountModel, mockAuthentication } from "@/domain/test"
import { DbAuthentication } from "./db-authentication"
import {
    AccountModel, Encrypter, HashComparer, LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
} from "./db-authentication-protocols"

describe('DB Authentication UseCase', () => {
    type SutTypes = {
        sut: DbAuthentication
        loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
        hashComparerStub: HashComparer
        encrypterStub: Encrypter
        updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
    }

    const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
        class LoadAccountByEmailRespositoryStub implements LoadAccountByEmailRepository {
            async loadByEmail (email: string): Promise<AccountModel> {
                return await new Promise(resolve => resolve(mockAccountModel()))
            }
        }
        return new LoadAccountByEmailRespositoryStub()
    }

    const makeHashComparerStub = (): HashComparer => {
        class HashCompareStub implements HashComparer {
            async compare (password: string, hash: string): Promise<boolean> {
                return true
            }
        }
        return new HashCompareStub()
    }

    const makeEncrypterStub = (): Encrypter => {
        class EncrypterStub implements Encrypter {
            async encrypt (value: string): Promise<string> {
                return await new Promise(resolve => resolve(makeFakeToken().token))
            }
        }
        return new EncrypterStub()
    }

    const makeUpdateAccessToken = (): UpdateAccessTokenRepository => {
        class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
            async updateAccessToken (id: string, token: string): Promise<void> {
                return await new Promise(resolve => resolve())
            }
        }
        return new UpdateAccessTokenRepositoryStub()
    }

    const makeSut = (): SutTypes => {
        const updateAccessTokenRepositoryStub = makeUpdateAccessToken()
        const encrypterStub = makeEncrypterStub()
        const hashComparerStub = makeHashComparerStub()
        const loadAccountByEmailRepositoryStub = makeLoadAccountStub()
        const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
        return {
            sut,
            loadAccountByEmailRepositoryStub,
            hashComparerStub,
            encrypterStub,
            updateAccessTokenRepositoryStub
        }
    }

    const makeFakeToken = (): any => ({
        token: 'any_token'
    })

    test('Should call Load Account Email Respository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        const data = mockAuthentication()
        await sut.auth(data)
        expect(loadSpy).toHaveBeenCalledWith(data.email)
    })

    test('Should throw if Load Account Email Respository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const data = mockAuthentication()
        const promise = sut.auth(data)
        await expect(promise).rejects.toThrow()
    })

    test('Should return null if Load Account Email Respository return null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const data = mockAccountModel()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null as any)
        const accessToken = await sut.auth(data)
        expect(accessToken).toBeNull()
    })

    test('Should call Hashcompare with correct password', async () => {
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        const data = mockAuthentication()
        const account = mockAccountModel()
        await sut.auth(data)
        expect(compareSpy).toHaveBeenCalledWith(data.password, account.password)
    })

    test('Should null if Hashcompare return null', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const data = mockAuthentication()
        const accessToken = await sut.auth(data)
        expect(accessToken).toBeNull()
    })

    test('Should return a Token with correct id', async () => {
        const { sut } = makeSut()
        const data = mockAuthentication()
        const accessToken = await sut.auth(data)
        expect(accessToken).toBe('any_token')
    })

    test('Should call UpdateAccessTokenRepository with correct values', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        const data = mockAuthentication()
        const account = mockAccountModel()
        await sut.auth(data)
        expect(updateSpy).toHaveBeenCalledWith(account.id, makeFakeToken().token)
    })
})
