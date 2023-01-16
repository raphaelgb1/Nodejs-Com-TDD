/* eslint-disable no-trailing-spaces */
import { AccountModel, AddAccountModel, AddAccount, Encrypter, AddAccountRepository } from "./db-add-account-protocols"

export class DBbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter
    private readonly addAccountRepository: AddAccountRepository
    
    constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccountRepository = addAccountRepository
    }

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const hasedPassword = await this.encrypter.encrypt(accountData.password)
        const account = await this.addAccountRepository.add({ ...accountData, password: hasedPassword })
        return account
    }
}
