import { AddSurveyModel } from '@/domain/useCases/survey/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb-helper'
import app from "@/main/config/app"
import env from "@/main/config/env"
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

const makeFakeSurvey = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fti%2Ffotos-gratis%2Fp3%2F6671766-fantastica-lua-magica-luz-e-agua-barco-com-arvore-papel-de-parede-gratis-foto.jpg&imgrefurl=https%3A%2F%2Fpt.vecteezy.com%2Ffotos-gratis%2Fwallpaper&tbnid=r5vd7e0NRGraEM&vet=12ahUKEwjcsZess6L9AhVMBbkGHStLAfYQMygBegUIARDhAQ..i&docid=8d9FITdypa4nIM&w=5105&h=2871&q=imagens&ved=2ahUKEwjcsZess6L9AhVMBbkGHStLAfYQMygBegUIARDhAQ',
        answer: 'any_answer1'
    },
    {
        answer: 'any_answer2'
    }],
    date: new Date()
})

const makeAccessToken = async (): Promise<string> => {
    const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        role: 'admin'
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

    describe('POST /surveys', () => {
        test('Should return 403 without any token', async () => {
            await request(app)
                .post('/api/surveys')
                .send(makeFakeSurvey())
                .expect(403)
        })

        test('Should return 204 on add survey success with valid token', async () => {
            const accessToken = await makeAccessToken()
            await request(app)
                .post('/api/surveys')
                .set('x-access-token', accessToken)
                .send(makeFakeSurvey())
                .expect(204)
        })
    })

    describe('GET /surveys', () => {
        test('Should return 403 without any token', async () => {
            await request(app)
                .get('/api/surveys')
                .expect(403)
        })

        test('Should return 200 on load survey with valid token', async () => {
            const accessToken = await makeAccessToken()
            await request(app)
                .get('/api/surveys')
                .set('x-access-token', accessToken)
                .expect(204)
        })
    })
})
