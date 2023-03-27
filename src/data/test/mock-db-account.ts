import { mockAccountModel } from "@/domain/test"
import { AccountModel, AddAccountParams, AddAccountRepository } from "../useCases/account/addAccount/db-add-account-protocols"

export const mockAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add (accountData: AddAccountParams): Promise<AccountModel> {
            return await new Promise(resolve => resolve(mockAccountModel(1)))
        }
    }
    return new AddAccountRepositoryStub()
}
