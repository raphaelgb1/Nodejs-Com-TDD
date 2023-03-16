import { SurveyModel } from "../../../domain/models/survey-model"
import { LoadSurveyRepository } from "../../protocols/db/survey/load-survey-repository"
import { DbLoadSurvey } from "./db-load-survey"

interface SutTypes {
    sut: DbLoadSurvey
    loadSurveyRepositoryStub: LoadSurveyRepository
}

const makeLoadSurveyRepositoryStub = (): LoadSurveyRepository => {
    class LoadSurveyRepositoryStub implements LoadSurveyRepository {
        async loadAll (): Promise<SurveyModel[]> {
            return await Promise.resolve(makeFakeSurvey())
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

const makeFakeSurvey = (): SurveyModel[] => {
    return [{
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    }]
}

describe('Db Load Survey', () => {
    test('Should call LoadSurveyRepository', async () => {
        const { sut, loadSurveyRepositoryStub } = makeSut()
        const loadAllSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
        await sut.load()
        expect(loadAllSpy).toHaveBeenCalled()
    })

    test('Should return a list of Surveys on success', async () => {
        const { sut } = makeSut()
        const surveys = await sut.load()
        expect(surveys).toEqual(makeFakeSurvey())
    })

    test('Should Throws if Surveys Repository throws', async () => {
        const { sut, loadSurveyRepositoryStub } = makeSut()
        jest.spyOn(loadSurveyRepositoryStub, 'loadAll').mockReturnValueOnce(
            Promise.reject(new Error())
        )
        const promise = sut.load()
        await expect(promise).rejects.toThrow()
    })
})
