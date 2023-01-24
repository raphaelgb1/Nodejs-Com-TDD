import { MongoHelper } from '../helpers/mongodb-helper'
import { LogMongoRepository } from './log-mongo-repository'

let errorCollection: any = null

const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await MongoHelper.close()
    })

    beforeEach(async () => {
        errorCollection = await MongoHelper.getCollection('errors')
        await errorCollection.deleteMany({})
    })

    test('Should create an error log on success', async () => {
        const sut = makeSut()
        await sut.logError(500, 'any_error')
        const count = await errorCollection.countDocuments()
        expect(count).toBe(1)
    })
})
