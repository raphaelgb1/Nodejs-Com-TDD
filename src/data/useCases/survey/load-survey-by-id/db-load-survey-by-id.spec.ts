import { throwError } from "@/domain/test"
import MockDate from "mockdate"
import { DbLoadSurveyById } from "./db-load-survey-by-id"
import { LoadSurveyByIdRepository, SurveyModel } from "./db-load-survey-by-id.-protocols"

interface SutTypes {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
        async loadById (): Promise<SurveyModel> {
            return await Promise.resolve(mockSurveyData())
        }
    }

    return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
    const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return {
        sut,
        loadSurveyByIdRepositoryStub
    }
}

const mockSurveyData = (): SurveyModel => {
    return {
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
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
        await sut.loadBySurveyId(mockSurveyData().id)
        expect(loadAllSpy).toHaveBeenCalled()
    })

    test('Should return Survey on Success', async () => {
        const { sut } = makeSut()
        const survey = await sut.loadBySurveyId('any_id')
        expect(survey).toEqual(mockSurveyData())
    })

    test('Should Throws if Surveys Repository throws', async () => {
        const { sut, loadSurveyByIdRepositoryStub } = makeSut()
        jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
        const promise = sut.loadBySurveyId(mockSurveyData().id)
        await expect(promise).rejects.toThrow()
    })
})
