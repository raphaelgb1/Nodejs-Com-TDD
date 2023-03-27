import { mockSurveyData } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb-helper'
import app from "@/main/config/app"
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
    const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password'
    })
    const id = result.insertedId
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
    return accessToken
}
describe('Survey Routes', () => {
    beforeAll(async () => {
        await MongoHelper.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await MongoHelper.close()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    describe('PUT /surveys/surveyId/results', () => {
        test('Should return 403 on SaveSurveyResult without access token', async () => {
            await request(app)
                .put('/api/surveys/any_id/results')
                .send(mockSurveyData().answers[0].answer)
                .expect(403)
        })

        test('Should return 200 on SaveSurveyResult with access token', async () => {
            const accessToken = await makeAccessToken()
            const result = await surveyCollection.insertOne(mockSurveyData())
            await request(app)
                .put(`/api/surveys/${result.insertedId.toString()}/results`)
                .set('x-access-token', accessToken)
                .send(mockSurveyData().answers[0].answer)
                .expect(403)
        })
    })
})
