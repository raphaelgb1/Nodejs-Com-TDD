/* eslint-disable comma-style */
import { AuthenticationModel } from "../../../domain/useCases/authentication"
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AccountModel } from "../addAccount/db-add-account-protocols"
import { DbAuthentication } from "./db-authentication"

describe('DB Authentication UseCase', () => {
    interface SutTypes {
        sut: DbAuthentication
        loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    }

    const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
        class LoadAccountByEmailRespository implements LoadAccountByEmailRepository {
            async load (email: string): Promise<AccountModel> {
                return await new Promise(resolve => resolve(makeFakeAccount()))
            }
        }
        return new LoadAccountByEmailRespository()
    }

    const makeSut = (): SutTypes => {
        const loadAccountByEmailRepositoryStub = makeLoadAccountStub()
        const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
        return {
            sut,
            loadAccountByEmailRepositoryStub
        }
    }

    const makeFakeAccount = (): AccountModel => ({
          id: 'any_id'
        , name: 'any_name'
        , email: 'any_email@gmail.com'
        , password: 'any_password'
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
})
