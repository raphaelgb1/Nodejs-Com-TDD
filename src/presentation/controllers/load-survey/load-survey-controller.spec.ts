import { noContent, responseOk, serverError } from '@/presentation/helper/http/httpHelper'
import MockDate from 'mockdate'
import { LoadSurveyController } from "./load-survey-controller"
import { LoadSurvey, SurveyModel } from "./load-survey-controller-protocols"

type SutTypes = {
    sut: LoadSurveyController
    loadSurveyStub: LoadSurvey
}

const makeLoadSurveyStub = (): LoadSurvey => {
    class LoadSurveyStub implements LoadSurvey {
        async load (): Promise<SurveyModel[]> {
            return await Promise.resolve(makeFakeSurvey())
        }
    }

    return new LoadSurveyStub()
}

const makeSut = (): SutTypes => {
    const loadSurveyStub = makeLoadSurveyStub()
    const sut = new LoadSurveyController(loadSurveyStub)
    return {
        sut,
        loadSurveyStub
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

describe('Add Survey Controller', () => {
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })
    test('Should call LoadSurveys', () => {
        const { sut, loadSurveyStub } = makeSut()
        const spyLoad = jest.spyOn(loadSurveyStub, 'load')
        sut.handle({})
        expect(spyLoad).toHaveBeenCalledWith()
    })

    test('Should return 200 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(responseOk(makeFakeSurvey()))
    })

     test('Should return 204 if LoadSurveys return empty', async () => {
        const { sut, loadSurveyStub } = makeSut()
        jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(
            Promise.resolve([])
        )
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(noContent())
    })

    test('Should return 500 LoadSurveys throws', async () => {
        const { sut, loadSurveyStub } = makeSut()
        jest.spyOn(loadSurveyStub, 'load').mockReturnValueOnce(
            Promise.reject(new Error())
        )
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(serverError(new Error()))
    })
})
