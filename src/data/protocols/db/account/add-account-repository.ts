import { AccountModel, AddAccountModel } from "@/data/useCases/account/addAccount/db-add-account-protocols"

export interface AddAccountRepository {
    add (accountData: AddAccountModel): Promise<AccountModel>
}
