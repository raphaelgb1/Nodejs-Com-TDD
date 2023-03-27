import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey-model'
import { mockAccountModel, mockSurveyData } from '@/domain/test'
import { SaveSurveyResultParams } from '@/domain/useCases/survey-result/save-survey-result'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongodb-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

const mockSurveyDataResult = (survey, account, indice = 0): SaveSurveyResultParams => ({
    surveyId: survey.insertedId,
    accountId: account.insertedId,
    answer: mockSurveyData().answers[0].answer,
    date: new Date()
})

type CollectionTypes = {
    survey: Collection
    account: Collection
    surveyResults: Collection
}

const collections = {} as unknown as CollectionTypes

const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
    const result = await collections.survey.insertOne(mockSurveyData())
    return result as unknown as SurveyModel
}

const makeAccount = async (): Promise<AccountModel> => {
    const result = await collections.account.insertOne(mockAccountModel())
    return result as unknown as AccountModel
}

describe('Survey Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await MongoHelper.close()
    })

    beforeEach(async () => {
        collections.survey = await MongoHelper.getCollection('surveys')
        await collections.survey.deleteMany({})

        collections.account = await MongoHelper.getCollection('accounts')
        await collections.account.deleteMany({})

        collections.surveyResults = await MongoHelper.getCollection('surveyResults')
        await collections.surveyResults.deleteMany({})
    })

    describe('Save', () => {
            test('Should add a Survey on success', async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const account = await makeAccount()
            const result = await sut.save(mockSurveyDataResult(survey, account))
            expect(result).toBeTruthy()
            expect(result.id).toBeTruthy()
            expect(result.answer).toBeTruthy()
        })

        test('Should update survey result if its not new', async () => {
            const sut = makeSut()
            const survey = await makeSurvey()
            const account = await makeAccount()
            const fakeRequest = await mockSurveyDataResult(survey, account, 1)
            const createSurvey = await collections.surveyResults.insertOne(mockSurveyDataResult(survey, account))
            const result = await sut.save(fakeRequest)
            const result2 = await collections.surveyResults.findOne({ _id: createSurvey.insertedId })
            expect(result).toBeTruthy()
            expect(result.id).toEqual(createSurvey.insertedId.toString())
            expect(result.answer).toBe(result2?.answer)
        })
    })
})
