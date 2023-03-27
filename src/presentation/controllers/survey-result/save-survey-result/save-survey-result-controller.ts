import { InvalidParamError } from "@/presentation/errors"
import { forbbiden, serverError } from "@/presentation/helper/http/httpHelper"
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-controller-protocols"

export class SaveSurveyResultController implements Controller {
    constructor (private readonly loadSurveyById: LoadSurveyById) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse | any> {
        try {
            const { surveyId } = httpRequest.params
            const { answer } = httpRequest.body
            const survey = await this.loadSurveyById.loadBySurveyId(surveyId)
            if (survey) {
                const answerResult = survey.answers.map(data => data.answer)
                if (!answerResult.includes(answer)) {
                    return forbbiden(new InvalidParamError('answer'))
                }
            } else {
                return forbbiden(new InvalidParamError('survey id'))
            }
            return null
        } catch (error) {
            return serverError(error)
        }
    }
}
