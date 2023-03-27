import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator"
import { makeDbLoadSurvey } from "@/main/factories/use-cases/survey/load-survey/db-load-survey-factory"
import { LoadSurveyController } from "@/presentation/controllers/load-survey/load-survey-controller"
import { Controller } from "@/presentation/protocols"

export const makeLoadSurveyController = (): Controller => {
    const controller = new LoadSurveyController(makeDbLoadSurvey())
    return makeLogControllerDecorator(controller)
}
