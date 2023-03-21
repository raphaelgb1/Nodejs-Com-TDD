import MockDate from "mockdate"
import { SurveyModel } from "@/domain/models/survey-model"
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository"
import { DbLoadSurveyById } from "./db-load-survey-by-id"

interface SutTypes {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
        async loadById (): Promise<SurveyModel> {
            return await Promise.resolve(makeFakeSurvey())
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

const makeFakeSurvey = (): SurveyModel => {
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
        await sut.loadBySurveyId(makeFakeSurvey().id)
        expect(loadAllSpy).toHaveBeenCalled()
    })
})
