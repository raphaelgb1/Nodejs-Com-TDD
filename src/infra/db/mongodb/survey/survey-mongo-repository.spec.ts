import { mockSurveyData } from '@/domain/test'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongodb-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
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

    describe('Add', () => {
        test('Should add a Survey on success', async () => {
        const sut = makeSut()
        const httpRequest = mockSurveyData()
        await sut.add(httpRequest)
        const survey = await surveyCollection.findOne({ question: httpRequest.question })
        expect(survey).toBeTruthy()
        })
    })

    describe('Load All', () => {
        test('Should load all Surveys on Success', async () => {
            await surveyCollection.insertMany([mockSurveyData(), { ...mockSurveyData(), question: "other_question" }])
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(2)
            expect(surveys[0].id).toBeTruthy()
            expect(surveys[0].question).toBe('any_question')
            expect(surveys[1].question).toBe('other_question')
        })

        test('Should load empty list', async () => {
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(0)
        })
    })

    describe('Load By Id', () => {
        test('Should call LoadSurveyById on success', async () => {
            const result = await surveyCollection.insertOne(mockSurveyData())
            const sut = makeSut()
            const survey = await sut.loadById(result.insertedId.toString())
            expect(survey).toBeTruthy()
            expect(survey.id).toBeTruthy()
        })

        test('Should load empty list', async () => {
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(0)
        })
    })
})
