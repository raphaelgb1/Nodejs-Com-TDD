import { badRequest } from "../../../helper/http/httpHelper"
import { AddSurveyController } from "./add-survey-controller"
import { AddSurvey, AddSurveyModel, HttpRequest, Validation } from "./add-survey-controller-protocols"

interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
    addSurveyStub: AddSurvey
}

const makeValidationStub = (): Validation => {
    class MakeValidationStub implements Validation {
        validate (input: any): Error {
            return null as any
        }
    }
    return new MakeValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
    class MakeAddSurvey implements AddSurvey {
        async add (data: AddSurveyModel): Promise<void> {
            return await new Promise(resolve => resolve())
        }
    }
    return new MakeAddSurvey()
}

const makeSut = (): SutTypes => {
    const addSurveyStub = makeAddSurvey()
    const validationStub = makeValidationStub()
    const sut = new AddSurveyController(validationStub, addSurveyStub)
    return {
        sut,
        validationStub,
        addSurveyStub
    }
}

const makeFakeSurvey = (): HttpRequest => ({
    body: {
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }]
    }
})

describe('Add Survey Controller', () => {
    test('Should Call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeSurvey()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('Should return 400 if Validation Fails', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const httpRequest = makeFakeSurvey()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new Error()))
    })

    test('Should call AddSurvey with correct values', async () => {
        const { sut, addSurveyStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyStub, 'add')
        const httpRequest = makeFakeSurvey()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})
