import MockDate from 'mockdate'
import { DbSaveSurveyResult } from "./db-save-survey-result"
import { SaveSurveyResultParams, SaveSurveyResultRespository, SurveyResultModel } from "./db-save-survey-result-protocols"

interface SutTypes {
    sut: DbSaveSurveyResult
    saveSurveyResultRepositoryStub: SaveSurveyResultRespository
}

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRespository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRespository {
        async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
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

const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
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

    test('Should Throws if Surveys Repository throws', async () => {
        const { sut, saveSurveyResultRepositoryStub } = makeSut()
        jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(
            Promise.reject(new Error())
        )
        const promise = sut.save(makeFakeSurveyResultData())
        await expect(promise).rejects.toThrow()
    })

    test('Should return Survey on Success', async () => {
        const { sut } = makeSut()
        const survey = await sut.save(makeFakeSurveyResultData())
        expect(survey).toEqual(makeFakeSurveyResult())
    })
})
