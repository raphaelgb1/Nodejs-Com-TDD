import { LogErrorRepository } from "@/data/protocols/db/log/log-error-repository"
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
            return await new Promise(resolve => resolve(responseOk(makeFakeAccount())))
        }
    }
    return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async logError (code: number, stack: string): Promise<void> {
            return await new Promise(resolve => resolve())
        }
    }
    return new LogErrorRepositoryStub()
}

const makeFakeAccount = (): any => ({
    name: "Raphael"
})

const makeFakeRequest = (): HttpRequest => ({
    body: {
      name: 'any_name',
      email: 'anyEmail@gmail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
})

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepositoryStub()
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
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('Should call controller handle ', async () => {
        const { sut } = makeSut()
        const httpRequest = makeFakeRequest()
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(responseOk(makeFakeAccount()))
    })

    test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error())))
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith(500, 'any_Stack_Error')
    })
})
