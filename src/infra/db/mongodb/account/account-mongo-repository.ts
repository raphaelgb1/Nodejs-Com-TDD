import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/useCases/add-account'
import { ObjectId } from 'mongodb'
import { AccountMongoSignature } from '../../interfaces/account-mongo-signature'
import { MongoHelper } from '../helpers/mongodb-helper'

export class AccountMongoRepository implements AccountMongoSignature {
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

    async updateAccessToken (id: string, token: string): Promise<void> {
        const accountColleciont = await MongoHelper.getCollection('accounts')
        await accountColleciont.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken: token } })
    }

    async loadByToken (token: string, role?: string | undefined): Promise<AccountModel> {
        const accountColleciont = await MongoHelper.getCollection('accounts')
        const account = await accountColleciont.findOne({ accessToken: token, $or: [{ role }, { role: 'admin' }] })
        return account && MongoHelper.mapper(account)
    }
}
