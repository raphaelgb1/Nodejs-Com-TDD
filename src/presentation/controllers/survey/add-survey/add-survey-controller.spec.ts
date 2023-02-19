import { AddSurveyController } from "./add-survey-controller"
import { HttpRequest, Validation } from "./add-survey-controller-protocols"

interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
}

const makeValidationStub = (): Validation => {
    class MakeValidationStub implements Validation {
        validate (input: any): Error {
            return null as any
        }
    }
    return new MakeValidationStub()
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub()
    const sut = new AddSurveyController(validationStub)
    return {
        sut,
        validationStub
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
})
