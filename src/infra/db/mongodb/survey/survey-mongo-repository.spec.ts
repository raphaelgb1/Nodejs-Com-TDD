import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/useCases/add-survey'
import { MongoHelper } from '../helpers/mongodb-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeFakeSurvey = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'image',
        answer: 'any_answer'
    },
    {
        answer: 'any_answer'
    }],
    date: new Date()
})

let surveyCollection: Collection

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await MongoHelper.close()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
    })

    const makeSut = (): SurveyMongoRepository => {
        return new SurveyMongoRepository()
    }

    test('Should return an account on add success', async () => {
       const sut = makeSut()
       const httpRequest = makeFakeSurvey()
       await sut.add(httpRequest)
       const survey = await surveyCollection.findOne({ question: httpRequest.question })
       expect(survey).toBeTruthy()
    })
})
