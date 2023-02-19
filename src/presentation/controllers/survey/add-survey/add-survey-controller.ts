import { badRequest } from "../../../helper/http/httpHelper"
import { AddSurvey, Controller, HttpRequest, HttpResponse, Validation } from "./add-survey-controller-protocols"

export class AddSurveyController implements Controller {
    constructor (
        private readonly validation: Validation,
        private readonly addSurvey: AddSurvey
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = this.validation.validate(httpRequest)
        if (error) {
            return badRequest(new Error())
        }
        const { question, answers } = httpRequest.body
        await this.addSurvey.add({ question, answers })
        return await new Promise(resolve => resolve(null as any))
    }
}
