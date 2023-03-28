import MockDate from 'mockdate';
import { mockSaveSurveyResultRepository } from '@/data/test';
import { mockSurveyResultModel, throwError } from '@/domain/test';
import { DbSaveSurveyResult } from './db-save-survey-result';
import { SaveSurveyResultRespository } from './db-save-survey-result-protocols';

interface SutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRespository
}

const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
    const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return {
        sut,
        saveSurveyResultRepositoryStub
    }
}

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
        const surveyResultData = mockSurveyResultModel()
        await sut.save(surveyResultData)
        expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
    })

    test('Should Throws if Surveys Repository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
        const promise = sut.save(mockSurveyResultModel())
        await expect(promise).rejects.toThrow()
    })

    test('Should return Survey on Success', async () => {
        const { sut } = makeSut()
        const survey = await sut.save(mockSurveyResultModel())
        expect(survey).toEqual(mockSurveyResultModel())
    })
})
