import { Router } from "express"
import { adaptRoute } from "../adapters/express/express-routes-adapter"
import { makeAddSurveyController } from "../factories/controllers/add-survey/add-survey-controller-factory"

export default async (router: Router): Promise<void> => {
    router.post('/surveys', (await adaptRoute(makeAddSurveyController())))
}
