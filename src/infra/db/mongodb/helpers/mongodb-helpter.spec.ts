import { MongoHelper as sut } from './mongodb-helper'

describe('Mongo Helper', () => {
    beforeAll(async () => {
        await sut.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await sut.close()
    })

    test('Should reconnect if mongodb was down', async () => {
        let accountColleciont = await sut.getCollection('accounts')
        expect(accountColleciont).toBeTruthy()
        await sut.close()
        accountColleciont = await sut.getCollection('accounts')
        expect(accountColleciont).toBeTruthy()
    })
})
