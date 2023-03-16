import MockDate from 'mockdate'
import { LoadSurveyController } from "./load-survey-controller"
import { LoadSurvey, SurveyModel } from "./load-survey-controller-protocols"

interface SutTypes {
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
})
