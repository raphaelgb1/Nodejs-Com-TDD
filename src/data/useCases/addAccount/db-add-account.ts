/* eslint-disable no-trailing-spaces */
import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols"
import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from "./db-add-account-protocols"

export class DBbAddAccount implements AddAccount {
    constructor (
        private readonly hasher: Hasher, 
        private readonly addAccountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {}

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.hasher.hash(accountData.password)
        const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
        this.loadAccountByEmailRepository.loadByEmail(account.email)
        return account
    }
}
