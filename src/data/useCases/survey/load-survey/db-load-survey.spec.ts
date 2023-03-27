import { mockArrSurveyData } from "@/domain/test"
import { throwError } from "@/domain/test/test-helpers"
import MockDate from "mockdate"
import { DbLoadSurvey } from "./db-load-survey"
import { LoadSurveyRepository, SurveyModel } from "./db-load-surveys-protocols"

interface SutTypes {
    sut: DbLoadSurvey
    loadSurveyRepositoryStub: LoadSurveyRepository
}

const makeLoadSurveyRepositoryStub = (): LoadSurveyRepository => {
    class LoadSurveyRepositoryStub implements LoadSurveyRepository {
        async loadAll (): Promise<SurveyModel[]> {
            return await Promise.resolve(mockArrSurveyData())
        }
    }

    return new LoadSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
    const loadSurveyRepositoryStub = makeLoadSurveyRepositoryStub()
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
