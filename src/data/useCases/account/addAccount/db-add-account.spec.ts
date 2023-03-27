/* eslint-disable no-trailing-spaces */
import { Hasher } from "@/data/protocols/criptografy/hasher"
import { mockHasher } from "@/data/test"
import { mockAccountModel } from "@/domain/test"
import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols"
import { DBbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountParams, AddAccountRepository } from "./db-add-account-protocols"

type SutTypes = {
  sut: DBbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRespositoryStub implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<AccountModel> {
          return await new Promise(resolve => resolve(null as any))
      }
  }
  return new LoadAccountByEmailRespositoryStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
        return await new Promise(resolve => resolve(mockAccountModel(1)))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountStub()
  const sut = new DBbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DBbAddAccount UseCase', () => {
  test('Should call Hasher with corret password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = mockAccountModel(1)
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })
  
  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = mockAccountModel(1)
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData: any = mockAccountModel(1)
    accountData.password = "hashed_password"
    delete accountData.id 
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountData)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = mockAccountModel(1)
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if on success', async () => {
    const { sut } = makeSut()
    const accountData = mockAccountModel(1)
    const account = await sut.add(accountData)
    expect(account).toEqual(accountData)
  })

  test('Should call Load Account Email Respository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const data = mockAccountModel(1)
    await sut.add(data)
    expect(loadSpy).toHaveBeenCalledWith(data.email)
  })

  test('Should return null if Load Account Email Respository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const data = mockAccountModel(1)
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(data))
    const account = await sut.add(data)
    expect(account).toBeNull()
  })
})
