import { AccountModel } from "@/data/useCases/account/addAccount/db-add-account-protocols"

export interface LoadAccountByTokenRepository {
    loadByToken (token: string, role?: string): Promise<AccountModel>
}
