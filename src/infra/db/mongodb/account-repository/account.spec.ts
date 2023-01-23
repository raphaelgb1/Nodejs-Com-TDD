import { Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongodb-helper'
import { AccountMongoRepository } from './account'

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
})

let accountCollection: Collection

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await MongoHelper.close()
    })

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository()
    }

    test('Should return an account on add success', async () => {
        const sut = makeSut()
        const account = await sut.add(makeFakeAccount())

        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any_email@email.com')
        expect(account.password).toBe('any_password')
    })

    test('Should return an account on load by EMAIL success', async () => {
        const sut = makeSut()
        await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
        })
        const account = await sut.loadByEmail(makeFakeAccount().email)

        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.name).toBe('any_name')
        expect(account.email).toBe('any_email@email.com')
        expect(account.password).toBe('any_password')
    })

    test('Should return null if load by EMAIL fails', async () => {
        const sut = makeSut()
        const account = await sut.loadByEmail(makeFakeAccount().email)
        expect(account).toBeFalsy()
    })

    test('Should update the account ACCESS TOKEN on UPDATE ACCESS TOKEN success ', async () => {
        const sut = makeSut()
        const result = await accountCollection.insertOne({
            name: 'any_name',
            email: 'any_email@email.com',
            password: 'any_password'
        }) as any
        expect(result.accessToken).toBeFalsy()
        await sut.updateAccessToken(result.insertedId, 'any_token')
        const account = await accountCollection.findOne({ _id: result.insertedId }) as any
        expect(account).toBeTruthy()
        expect(account.accessToken).toBe('any_token')
    })
})
