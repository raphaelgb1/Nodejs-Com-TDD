import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongodb-helper'
import { AccountMongoRepository } from './account'

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
})

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await MongoHelper.close()
    })

    beforeEach(async () => {
        const accountColleciont = await MongoHelper.getCollection('accounts')
        await accountColleciont.deleteMany({})
    })

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository()
    }

    test('Should return an account on success', async () => {
        const sut = makeSut()
        const account = await sut.add(makeFakeAccount())

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
    })
})
