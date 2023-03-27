import { AccountModel, AddAccountParams } from "@/data/useCases/account/addAccount/db-add-account-protocols"

export interface AddAccountRepository {
    add (accountData: AddAccountParams): Promise<AccountModel>
}
