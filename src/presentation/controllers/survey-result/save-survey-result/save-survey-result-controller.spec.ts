import { InvalidParamError } from "@/presentation/errors"
import { forbbiden } from "@/presentation/helper/http/httpHelper"
import { SurveyModel } from "../../load-survey/load-survey-controller-protocols"
import { SaveSurveyResultController } from "./save-survey-result-controller"
import { HttpRequest, LoadSurveyById } from "./save-survey-result-controller-protocols"

type SutTypes = {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
    const loadSurveyByIdStub = makeFakeLoadSurveyById()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub)
    return {
        sut,
        loadSurveyByIdStub
    }
}

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    }
})

const makeFakeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadBySurveyId (id: String): Promise<SurveyModel> {
            return await Promise.resolve(makeFakeSurvey())
        }
    }

    return new LoadSurveyByIdStub()
}

const makeFakeSurvey = (): SurveyModel => ({
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    })

describe('Save Survey Result Controller', () => {
    test('Should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const spyLoadById = jest.spyOn(loadSurveyByIdStub, 'loadBySurveyId')
        await sut.handle(makeFakeRequest())
        expect(spyLoadById).toHaveBeenCalledWith(makeFakeRequest().params.surveyId)
    })

    test('Should return 403 if LoadSurveyById with returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null as any))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbbiden(new InvalidParamError('Invalid Survey Id')))
    })
})
