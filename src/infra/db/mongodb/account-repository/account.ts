import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/useCases/add-account'
import { MongoHelper } from '../helpers/mongodb-helper'

export class AccountMongoRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const insert = await accountCollection.insertOne(accountData)
        const get = await accountCollection.findOne(insert.insertedId)
        return MongoHelper.mapper(get)
    }
}
