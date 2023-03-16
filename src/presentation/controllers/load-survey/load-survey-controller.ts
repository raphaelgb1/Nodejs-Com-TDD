import { Controller, HttpRequest, HttpResponse, LoadSurvey } from "./load-survey-controller-protocols"

export class LoadSurveyController implements Controller {
    constructor (private readonly loadSurvey: LoadSurvey) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        this.loadSurvey.load()
        return await Promise.resolve(null as any)
    }
}
