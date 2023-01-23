import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/useCases/add-account'
import { MongoHelper } from '../helpers/mongodb-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const insert = await accountCollection.insertOne(accountData)
        const get = await accountCollection.findOne(insert.insertedId)
        return MongoHelper.mapper(get)
    }

    async loadByEmail (email: string): Promise<AccountModel> {
        const accountColleciont = await MongoHelper.getCollection('accounts')
        const account = await accountColleciont.findOne({ email })
        return account && MongoHelper.mapper(account)
    }
}
