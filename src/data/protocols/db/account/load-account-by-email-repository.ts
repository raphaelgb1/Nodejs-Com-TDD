import { AccountModel } from "@/data/useCases/account/addAccount/db-add-account-protocols"

export interface LoadAccountByEmailRepository {
    loadByEmail (email: string): Promise<AccountModel>
}
