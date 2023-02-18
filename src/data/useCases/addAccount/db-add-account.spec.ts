/* eslint-disable no-trailing-spaces */
import { Hasher } from "../../protocols/criptografy/hasher"
import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols"
import { DBbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountModel, AddAccountRepository } from "./db-add-account-protocols"

interface SutTypes {
  sut: DBbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
        return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeLoadAccountStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRespositoryStub implements LoadAccountByEmailRepository {
      async loadByEmail (email: string): Promise<AccountModel> {
          return await new Promise(resolve => resolve(makeFakeAccount()))
      }
  }
  return new LoadAccountByEmailRespositoryStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const fakeAccount = {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email@gmail.com',
          password: 'valid_password'
        }
        return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
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

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'valid_password'
})

describe('DBbAddAccount UseCase', () => {
  test('Should call Hasher with corret password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = makeFakeAccount()
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })
  
  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = makeFakeAccount()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData: any = makeFakeAccount()
    accountData.password = "hashed_password"
    delete accountData.id 
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountData)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = makeFakeAccount()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account if on success', async () => {
    const { sut } = makeSut()
    const accountData = makeFakeAccount()
    const account = await sut.add(accountData)
    expect(account).toEqual(makeFakeAccount())
  })

  test('Should return null if Load Account Email Respository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const data = makeFakeAccount()
    await sut.add(data)
    expect(loadSpy).toHaveBeenCalledWith('valid_email@gmail.com')
})
})
