import { AccountModel, AddAccountModel } from "../../../useCases/addAccount/db-add-account-protocols"

export interface AddAccountRepository {
    add (accountData: AddAccountModel): Promise<AccountModel>
}
