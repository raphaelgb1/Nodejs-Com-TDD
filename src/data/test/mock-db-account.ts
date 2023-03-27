import { mockAccountModel } from "@/domain/test"
import { LoadAccountByEmailRepository } from "../protocols/db/account/load-account-by-email-repository"
import { AccountModel, AddAccountParams, AddAccountRepository } from "../useCases/account/addAccount/db-add-account-protocols"

export const mockAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountParams): Promise<AccountModel> {
            return await new Promise(resolve => resolve(mockAccountModel(1)))
        }
    }
    return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRespositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail (email: string): Promise<AccountModel> {
            return await new Promise(resolve => resolve(null as any))
        }
    }
    return new LoadAccountByEmailRespositoryStub()
  }
