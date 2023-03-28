import { mockLoadSurveyByIdRepository } from "@/data/test"
import { mockSurveyModel, throwError } from "@/domain/test"
import MockDate from "mockdate"
import { DbLoadSurveyById } from "./db-load-survey-by-id"
import { LoadSurveyByIdRepository } from "./db-load-survey-by-id.-protocols"

interface SutTypes {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return {
        sut,
        loadSurveyByIdRepositoryStub
    }
}

describe('Db Load Survey By Id', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })

    test('Should call LoadSurveyByIdRepository', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        const loadAllSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
        await sut.loadBySurveyId(mockSurveyModel().id)
        expect(loadAllSpy).toHaveBeenCalled()
    })

    test('Should return Survey on Success', async () => {
        const { sut } = makeSut()
        const survey = await sut.loadBySurveyId('any_id')
        expect(survey).toEqual(mockSurveyModel())
    })

    test('Should Throws if Surveys Repository throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
        const promise = sut.loadBySurveyId(mockSurveyModel().id)
        await expect(promise).rejects.toThrow()
    })
})
