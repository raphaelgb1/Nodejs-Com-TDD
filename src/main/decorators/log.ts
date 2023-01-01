import { Controller, HttpRequest } from "../../presentation/protocols"

export default class LogControllerDecorator implements Controller {
    private readonly controller: Controller

    constructor (controller: Controller) {
        this.controller = controller
    }

    async handle (httpRequest: HttpRequest): Promise<any> {
        await this.controller.handle(httpRequest)
        return null
    }
}
