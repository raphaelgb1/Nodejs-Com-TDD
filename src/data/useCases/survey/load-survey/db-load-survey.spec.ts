import { mockLoadSurveyRepository } from "@/data/test"
import { mockArrSurveyData, throwError } from "@/domain/test"
import MockDate from "mockdate"
import { DbLoadSurvey } from "./db-load-survey"
import { LoadSurveyRepository } from "./db-load-surveys-protocols"

interface SutTypes {
    sut: DbLoadSurvey
    loadSurveyRepositoryStub: LoadSurveyRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyRepositoryStub = mockLoadSurveyRepository()
    const sut = new DbLoadSurvey(loadSurveyRepositoryStub)
    return {
        sut,
        loadSurveyRepositoryStub
    }
}

describe('Db Load Survey', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })
    test('Should call LoadSurveyRepository', async () => {
        const { sut, loadSurveyRepositoryStub } = makeSut()
        const loadAllSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
        await sut.load()
        expect(loadAllSpy).toHaveBeenCalled()
    })

    test('Should return a list of Surveys on success', async () => {
        const { sut } = makeSut()
        const surveys = await sut.load()
        expect(surveys).toEqual(mockArrSurveyData())
    })

    test('Should Throws if Surveys Repository throws', async () => {
        const { sut, loadSurveyRepositoryStub } = makeSut()
        jest.spyOn(loadSurveyRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
        const promise = sut.load()
        await expect(promise).rejects.toThrow()
    })
})
