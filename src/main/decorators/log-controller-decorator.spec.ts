import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository"
import { mockLogErrorRepository } from "@/data/test"
import { mockName, mockRequest } from "@/domain/test"

import { responseOk, serverError } from "@/presentation/helper/http/httpHelper"
import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import LogControllerDecorator from "./log-controller-decorator"

type SutTypes = {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            return await new Promise(resolve => resolve(responseOk(mockName())))
        }
    }
    return new ControllerStub()
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = mockLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}

const error = (): HttpResponse => {
    return serverError({ ...new Error(), stack: 'any_Stack_Error' })
}

describe('Log Controller Decorator', () => {
    test('Should call controller handle ', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const httpRequest = mockRequest()
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('Should call controller handle ', async () => {
        const { sut } = makeSut()
        const httpRequest = mockRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(responseOk(mockName()))
    })

    test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error())))
        const httpRequest = mockRequest()
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith(500, 'any_Stack_Error')
    })
})
