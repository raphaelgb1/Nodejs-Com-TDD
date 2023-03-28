import { SurveyResultModel } from "@/domain/models/survey-result"
import { mockRequestParam, mockSurveyResultData, mockSurveyResultModel, mockSurveyModel, throwError } from "@/domain/test"
import { InvalidParamError } from "@/presentation/errors"
import MockDate from 'mockdate'
import { SaveSurveyResultController } from "./save-survey-result-controller"
import { forbbiden, LoadSurveyById, responseOk, SaveSurveyResult, SaveSurveyResultParams, serverError, SurveyModel } from "./save-survey-result-controller-protocols"

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

const makeFakeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
        async loadBySurveyId (id: String): Promise<SurveyModel> {
            return await Promise.resolve(mockSurveyModel())
        }
    }

    return new LoadSurveyByIdStub()
}

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
        async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return await Promise.resolve(mockSurveyResultModel())
        }
    }
    return new SaveSurveyResultStub()
}

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
        await sut.handle(mockRequestParam())
        expect(spyLoadById).toHaveBeenCalledWith(mockRequestParam().params.surveyId)
    })

    test('Should return 403 if LoadSurveyById returns null', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null as any))
        const httpResponse = await sut.handle(mockRequestParam())
        expect(httpResponse).toEqual(forbbiden(new InvalidParamError('survey id')))
    })

    test('Should return 500 LoadSurveysById throws', async () => {
        const { sut, loadSurveyByIdStub } = makeSut()
        jest.spyOn(loadSurveyByIdStub, 'loadBySurveyId').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequestParam())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 403 if invalid answer is provided', async () => {
        const { sut } = makeSut()
        const httpRequest = mockRequestParam()
        httpRequest.body.answer = 'wrong_answer'
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(forbbiden(new InvalidParamError('answer')))
    })

    test('Should call SaveSurveyResult with correct values', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        const spySave = jest.spyOn(saveSurveyResultStub, 'save')
        await sut.handle(mockRequestParam())
        expect(spySave).toHaveBeenCalledWith(mockSurveyResultData())
    })

    test('Should return 500 LoadSurveysById throws', async () => {
        const { sut, saveSurveyResultStub } = makeSut()
        jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
        const httpResponse = await sut.handle(mockRequestParam())
        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle(mockRequestParam())
        expect(httpResponse).toEqual(responseOk(mockSurveyResultModel()))
    })
})
