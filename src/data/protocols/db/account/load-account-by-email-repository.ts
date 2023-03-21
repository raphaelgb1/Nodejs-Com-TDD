import { AccountModel } from "@/data/useCases/addAccount/db-add-account-protocols"

export interface LoadAccountByEmailRepository {
    loadByEmail (email: string): Promise<AccountModel>
}
