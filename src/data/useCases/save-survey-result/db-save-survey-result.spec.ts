import { SaveSurveyResultRespository } from '@/data/protocols/db/survey/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/useCases/save-survey-result'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from "./db-save-survey-result"

interface SutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRespository
}

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRespository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRespository {
        async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
            return await Promise.resolve(makeFakeSurveyResult())
        }
    }
    return new SaveSurveyResultRepositoryStub()
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return {
        sut,
        saveSurveyResultRepositoryStub
    }
}

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
    ...makeFakeSurveyResultData(),
    id: 'any_id'
})

describe('DbAddSurvey Usecase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })
    test('Should call Save Survey Result Repository with correct values', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
        const surveyResultData = makeFakeSurveyResultData()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })
})
