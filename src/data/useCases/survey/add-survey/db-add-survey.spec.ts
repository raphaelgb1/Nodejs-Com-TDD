import MockDate from 'mockdate'
import { DbAddSurvey } from "./db-add-survey"
import { AddSurveyModel, AddSurveyRepository } from "./db-add-survey-protocols"

interface SutTypes {
    sut: DbAddSurvey
    addSurveyRepositoryStub: AddSurveyRepository
}

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
    class AddSurveyRepository implements AddSurveyRepository {
        async add (surveyData: AddSurveyModel): Promise<void> {
            return await new Promise(resolve => resolve())
        }
    }
    return new AddSurveyRepository()
}

const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    return {
        sut,
        addSurveyRepositoryStub
    }
}

const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }],
    date: new Date()
})

describe('DbAddSurvey Usecase', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    beforeAll(() => {
        MockDate.reset()
    })
    test('Should call Add Survey Repository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
        const httpRequest = makeFakeSurveyData()
        await sut.add(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest)
    })
})