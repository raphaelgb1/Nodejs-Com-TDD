import { Controller, HttpRequest, LoadSurveyById } from "./save-survey-result-controller-protocols"

export class SaveSurveyResultController implements Controller {
    constructor (private readonly loadSurveyById: LoadSurveyById) {}

    async handle (httpRequest: HttpRequest): Promise<any> {
        await this.loadSurveyById.loadBySurveyId(httpRequest.params.surveyId)
        return null
    }
}
