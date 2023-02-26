import { Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongodb-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password'
})

let accountCollection: Collection

const role = 'admin'

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

    describe('Add - Account Mongo Repository', () => {
        test('Should return an account on add success', async () => {
            const sut = makeSut()
            const account = await sut.add(makeFakeAccount())

            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })
    })

    describe('Load By Email - Account Mongo Repository', () => {
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
    })

    describe('Update Access Token - Account Mongo Repository', () => {
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

    describe('Load By Token - Account Mongo Repository', () => {
        test('Should return an account on load by TOKEN success without ADM role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                accessToken: 'any_token'
            })
            const account = await sut.loadByToken('any_token')

            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })

        test('Should return an account on load by TOKEN success with ADM role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                accessToken: 'any_token',
                role
            })
            const account = await sut.loadByToken('any_token', role)

            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })

        test('Should return null  on load by TOKEN success without a valid ADM role', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                accessToken: 'any_token'
            })
            const account = await sut.loadByToken('any_token', role)
            expect(account).toBeFalsy()
        })

        test('Should return an account on load by TOKEN if user is ADM', async () => {
            const sut = makeSut()
            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                accessToken: 'any_token',
                role
            })
            const account = await sut.loadByToken('any_token')

            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
            expect(account.name).toBe('any_name')
            expect(account.email).toBe('any_email@email.com')
            expect(account.password).toBe('any_password')
        })

        test('Should return null if load by TOKEN fails', async () => {
            const sut = makeSut()
            const account = await sut.loadByToken('any_token')
            expect(account).toBeFalsy()
        })
    })
})
