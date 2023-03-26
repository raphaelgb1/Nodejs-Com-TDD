import { InvalidParamError } from "@/presentation/errors"
import { forbbiden } from "@/presentation/helper/http/httpHelper"
import { Controller, HttpRequest, LoadSurveyById } from "./save-survey-result-controller-protocols"

export class SaveSurveyResultController implements Controller {
    constructor (private readonly loadSurveyById: LoadSurveyById) {}

    async handle (httpRequest: HttpRequest): Promise<any> {
        const result = await this.loadSurveyById.loadBySurveyId(httpRequest.params.surveyId)
        if (!result) {
            return forbbiden(new InvalidParamError('Invalid Survey Id'))
        }
        return null
    }
}
