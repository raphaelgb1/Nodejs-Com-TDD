import { InvalidParamError } from "@/presentation/errors"
import { forbbiden, responseOk, serverError } from "@/presentation/helper/http/httpHelper"
import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from "./save-survey-result-controller-protocols"

export class SaveSurveyResultController implements Controller {
    constructor (private readonly loadSurveyById: LoadSurveyById
               , private readonly saveSurveyResul: SaveSurveyResult) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse | any> {
        try {
            const { surveyId } = httpRequest.params
            const { answer } = httpRequest.body
            const { accountId } = httpRequest
            const survey = await this.loadSurveyById.loadBySurveyId(surveyId)
            if (survey) {
                const answerResult = survey.answers.map(data => data.answer)
                if (!answerResult.includes(answer)) {
                    return forbbiden(new InvalidParamError('answer'))
                }
            } else {
                return forbbiden(new InvalidParamError('survey id'))
            }
            const surveyResult = await this.saveSurveyResul.save({
                accountId,
                surveyId,
                date: new Date(),
                answer
            })
            return responseOk(surveyResult)
        } catch (error) {
            return serverError(error)
        }
    }
}
