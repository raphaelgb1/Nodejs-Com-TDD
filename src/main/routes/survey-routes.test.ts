import { Collection } from 'mongodb'
import request from 'supertest'
import { AddSurveyModel } from '../../domain/useCases/add-survey'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongodb-helper'
import app from "../config/app"

let surveyColleciont: Collection

const makeFakeSurvey = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fti%2Ffotos-gratis%2Fp3%2F6671766-fantastica-lua-magica-luz-e-agua-barco-com-arvore-papel-de-parede-gratis-foto.jpg&imgrefurl=https%3A%2F%2Fpt.vecteezy.com%2Ffotos-gratis%2Fwallpaper&tbnid=r5vd7e0NRGraEM&vet=12ahUKEwjcsZess6L9AhVMBbkGHStLAfYQMygBegUIARDhAQ..i&docid=8d9FITdypa4nIM&w=5105&h=2871&q=imagens&ved=2ahUKEwjcsZess6L9AhVMBbkGHStLAfYQMygBegUIARDhAQ',
        answer: 'any_answer1'
    },
    {
        answer: 'any_answer2'
    }]
})

describe('Survey Routes', () => {
    beforeAll(async () => {
        await MongoHelper.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await MongoHelper.close()
    })

    beforeEach(async () => {
        surveyColleciont = await MongoHelper.getCollection('surveys')
        await surveyColleciont.deleteMany({})
    })

    describe('POST /surveys', () => {
        test('Should return 403 on add survey success', async () => {
            await request(app)
                .post('/api/surveys')
                .send(makeFakeSurvey())
                .expect(403)
        })
    })
    // describe('POST /surveys', () => {
    //     test('Should return 200 on surveys', async () => {
    //         const password = await hash('123', parseInt(env.salt as any))
    //         await surveyColleciont.insertOne({
    //             name: 'any_name',
    //             email: 'any_email@gmail.com',
    //             password
    //         })
    //         await request(app)
    //             .post('/api/surveys')
    //             .send({
    //                 email: 'any_email@gmail.com',
    //                 password: '123'
    //             })
    //             .expect(200)
    //     })

    //     test('Should return 401 on surveys', async () => {
    //         await request(app)
    //             .post('/api/surveys')
    //             .send({
    //                 email: 'any_email@gmail.com',
    //                 password: '123'
    //             })
    //             .expect(401)
    //     })
    // })
})
