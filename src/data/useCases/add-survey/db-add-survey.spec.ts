import { DbAddSurvey } from "./db-add-survey"
import { AddSurveyModel, AddSurveyRepository } from "./db-add-survey-protocols"

interface SutTypes {
    sut: DbAddSurvey
    addSurveyRepositoryStub: AddSurveyRepository
}

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
    class AddSurveyRepository implements AddSurveyRepository {
        async add (data: AddSurveyModel): Promise<void> {
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
    }]
})

describe('DbAddSurvey Usecase', () => {
    test('Should call Add Survey Repository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
        const httpRequest = makeFakeSurveyData()
        await sut.add(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest)
    })

    // test('Should throws Add Survey Repository throws', async () => {
    //     const { sut, addSurveyRepositoryStub } = makeSut()
    //     jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(
    //         new Promise((resolve, reject) => reject(new Error())
    //     ))
    //     const httpRequest = makeFakeSurveyData()
    //     const promise = await sut.add(httpRequest)
    //     await expect(promise).rejects.toThrow()
    // })
})
