import { LogErrorRepository } from "../../data/protocols/db/log/log-error-repository"
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols"

export default class LogControllerDecorator implements Controller {
    constructor (private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest)
        if ([500, 400].includes(httpResponse.statusCode)) {
            await this.logErrorRepository.logError(httpResponse.statusCode, httpResponse.body.stack)
        }
        return httpResponse
    }
}
