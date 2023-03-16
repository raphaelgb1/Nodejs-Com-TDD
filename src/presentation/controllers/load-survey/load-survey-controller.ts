import { responseOk, serverError } from "../../helper/http/httpHelper"
import { Controller, HttpRequest, HttpResponse, LoadSurvey } from "./load-survey-controller-protocols"

export class LoadSurveyController implements Controller {
    constructor (private readonly loadSurvey: LoadSurvey) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const httResponse = await this.loadSurvey.load()
            return responseOk(httResponse)
        } catch (error) {
            return serverError(error)
        }
    }
}
