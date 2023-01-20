/* eslint-disable comma-style */
import { AuthenticationModel } from "../../../domain/useCases/authentication"
import { HashComparer } from "../../protocols/criptografy/hash-comparer"
import { TokenGenerator } from "../../protocols/criptografy/tokenGenerator"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../addAccount/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

describe('DB Authentication UseCase', () => {
    interface SutTypes {
        sut: DbAuthentication
        loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
        hashComparerStub: HashComparer
        tokenGeneratorStub: TokenGenerator
    }

    const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
        class LoadAccountByEmailRespositoryStub implements LoadAccountByEmailRepository {
            async load (email: string): Promise<AccountModel> {
                return await new Promise(resolve => resolve(makeFakeAccount()))
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

    const makeTokenGeneratorStub = (): TokenGenerator => {
        class TokenGeneratorStub implements TokenGenerator {
            async generate (id: string): Promise<string> {
                return await new Promise(resolve => resolve(makeFakeToken().token))
            }
        }
        return new TokenGeneratorStub()
    }

    const makeSut = (): SutTypes => {
        const tokenGeneratorStub = makeTokenGeneratorStub()
        const hashComparerStub = makeHashComparerStub()
        const loadAccountByEmailRepositoryStub = makeLoadAccountStub()
        const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub)
        return {
            sut,
            loadAccountByEmailRepositoryStub,
            hashComparerStub,
            tokenGeneratorStub
        }
    }

    const makeFakeToken = (): any => ({
        token: 'any_token'
    })

    const makeFakeAccount = (): AccountModel => ({
          id: 'any_id'
        , name: 'any_name'
        , email: 'any_email@gmail.com'
        , password: 'hashed_password'
    })

    const makeFakeAuth = (): AuthenticationModel => {
        const email = 'any_email@gmail.com'
        const password = 'any_password'
        return { email, password }
    }

    test('Should call Load Account Email Respository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        const data = makeFakeAuth()
        await sut.auth(data)
        expect(loadSpy).toHaveBeenCalledWith(data.email)
    })

    test('Should throw if Load Account Email Respository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const data = makeFakeAuth()
        const promise = sut.auth(data)
        await expect(promise).rejects.toThrow()
    })

    test('Should return null if Load Account Email Respository return null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const data = makeFakeAccount()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null as any)
        const accessToken = await sut.auth(data)
        expect(accessToken).toBeNull()
    })

    test('Should call Hashcompare with correct password', async () => {
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        const data = makeFakeAuth()
        const account = makeFakeAccount()
        await sut.auth(data)
        expect(compareSpy).toHaveBeenCalledWith(data.password, account.password)
    })

    test('Should throws if Hashcompare throw', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        const data = makeFakeAuth()
        const accessToken = await sut.auth(data)
        expect(accessToken).toBeNull()
    })

    test('Should call Token Generator with correct id', async () => {
        const { sut } = makeSut()
        const data = makeFakeAuth()
        const accessToken = await sut.auth(data)
        expect(accessToken).toBe('any_token')
    })
})
