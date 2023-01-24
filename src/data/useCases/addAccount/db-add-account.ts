/* eslint-disable no-trailing-spaces */
import { AccountModel, AddAccountModel, AddAccount, Hasher, AddAccountRepository } from "./db-add-account-protocols"

export class DBbAddAccount implements AddAccount {
    constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {}

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.hasher.hash(accountData.password)
        const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
        return account
    }
}
