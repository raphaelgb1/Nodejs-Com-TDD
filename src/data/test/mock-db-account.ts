import { mockAccountModel } from "@/domain/test"
import { LoadAccountByEmailRepository } from "../protocols/db/account/load-account-by-email-repository"
import { LoadAccountByTokenRepository } from "../protocols/db/account/load-accountby-token-repository"
import { UpdateAccessTokenRepository } from "../protocols/db/account/update-access-token-repository"
import { AccountModel, AddAccountParams, AddAccountRepository } from "../useCases/account/addAccount/db-add-account-protocols"

export const mockAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepository implements AddAccountRepository {
        async add (accountData: AddAccountParams): Promise<AccountModel> {
            return await new Promise(resolve => resolve(mockAccountModel(1)))
        }
    }
    return new AddAccountRepository()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRespository implements LoadAccountByEmailRepository {
        async loadByEmail (email: string): Promise<AccountModel> {
            return await new Promise(resolve => resolve(null as any))
        }
    }
    return new LoadAccountByEmailRespository()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepository implements LoadAccountByTokenRepository {
        async loadByToken (token: string, role?: string): Promise<AccountModel> {
            return await Promise.resolve(mockAccountModel(1))
        }
    }
    return new LoadAccountByTokenRepository()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepository implements UpdateAccessTokenRepository {
        async updateAccessToken (id: string, token: string): Promise<void> {
            return await new Promise(resolve => resolve())
        }
    }
    return new UpdateAccessTokenRepository()
}
