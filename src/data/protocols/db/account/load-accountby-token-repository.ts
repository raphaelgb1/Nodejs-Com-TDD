import { AccountModel } from "@/data/useCases/addAccount/db-add-account-protocols"

export interface LoadAccountByTokenRepository {
    loadByToken (token: string, role?: string): Promise<AccountModel>
}
