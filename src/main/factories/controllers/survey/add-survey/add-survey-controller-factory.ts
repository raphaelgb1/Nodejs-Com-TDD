import { AddSurveyController } from "@/presentation/controllers/survey/add-survey/add-survey-controller"
import { Controller } from "@/presentation/protocols"
import { makeLogControllerDecorator } from "@/main/factories/decorators/log-controller-decorator"
import { makeDbAddSurvey } from "@/main/factories/use-cases/survey/add-survey/db-add-survey-factory"
import { makeAddSurveyValidation } from "./add-survey-validation-factory"

export const makeAddSurveyController = (): Controller => {
    const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
    return makeLogControllerDecorator(controller)
}
