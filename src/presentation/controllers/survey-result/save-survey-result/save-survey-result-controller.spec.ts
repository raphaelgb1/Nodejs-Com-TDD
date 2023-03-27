import { SurveyResultModel } from "@/domain/models/survey-result"
import { InvalidParamError } from "@/presentation/errors"
import MockDate from 'mockdate'
import { SaveSurveyResultController } from "./save-survey-result-controller"
import { forbbiden, HttpRequest, LoadSurveyById, responseOk, SaveSurveyResult, SaveSurveyResultParams, serverError, SurveyModel } from "./save-survey-result-controller-protocols"

type SutTypes = {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
    saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
    const saveSurveyResultStub = makeSaveSurveyResultStub()
    const loadSurveyByIdStub = makeFakeLoadSurveyById()
    const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
    return {
        sut,
        loadSurveyByIdStub,
        saveSurveyResultStub
    }
}

const makeFakeRequest = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    },
    body: { answer: 'any_answer' },
    accountId: 'any_account_id'
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
    id: 'valid_id',
    surveyId: 'valid_survey_id',
    accountId: 'valid_account_id',
    date: new Date(),
    answer: 'valid_answer'
})

const makeFakeSurveyResultCall = (): unknown => ({
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    date: new Date(),
    answer: 'any_answer'
})

const makeFakeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadBySurveyId (id: String): Promise<SurveyModel> {
            return await Promise.resolve(makeFakeSurvey())
        }
    }

    return new LoadSurveyByIdStub()
}

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return await Promise.resolve(makeFakeSurveyResult())
        }
    }
    return new SaveSurveyResultStub()
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
    beforeAll(() => {
        MockDate.set(new Date())
    })

    afterAll(() => {
        MockDate.reset()
    })
    test('Should call LoadSurveyById with correct values', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        const spyLoadById = jest.spyOn(loadSurveyByIdStub, 'loadBySurveyId')
        await sut.handle(makeFakeRequest())
        expect(spyLoadById).toHaveBeenCalledWith(makeFakeRequest().params.surveyId)
    })

    test('Should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null as any))
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(forbbiden(new InvalidParamError('survey id')))
    })

    test('Should return 500 LoadSurveysById throws', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadBySurveyId').mockReturnValueOnce(
            Promise.reject(new Error())
        )
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 403 if invalid answer is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        httpRequest.body.answer = 'wrong_answer'
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(forbbiden(new InvalidParamError('answer')))
    })

    test('Should call SaveSurveyResult with correct values', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        const spySave = jest.spyOn(saveSurveyResultStub, 'save')
        await sut.handle(makeFakeRequest())
        expect(spySave).toHaveBeenCalledWith(makeFakeSurveyResultCall())
    })

    test('Should return 500 LoadSurveysById throws', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(
            Promise.reject(new Error())
        )
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(makeFakeRequest())
        expect(httpResponse).toEqual(responseOk(makeFakeSurveyResult()))
    })
})
