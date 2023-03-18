import { LoadSurveyController } from "../../../../../presentation/controllers/load-survey/load-survey-controller"
import { Controller } from "../../../../../presentation/protocols"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator"
import { makeDbLoadSurvey } from "../../../use-cases/survey/load-survey/db-load-survey"

export const makeLoadSurveyController = (): Controller => {
    const controller = new LoadSurveyController(makeDbLoadSurvey())
    return makeLogControllerDecorator(controller)
}
