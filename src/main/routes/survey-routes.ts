import { Router } from "express"
import { adaptRoute } from "../adapters/express/express-routes-adapter"
import { makeAddSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory"
import { makeLoadSurveyController } from "../factories/controllers/survey/load-survey/load-survey-controller-factory"
import { adminAuth } from "../middlewares/admin-auth"
import { auth } from "../middlewares/auth"

export default async (router: Router): Promise<void> => {
    router.post('/surveys', await adminAuth, (await adaptRoute(makeAddSurveyController())))
    router.get('/surveys', await auth, (await adaptRoute(makeLoadSurveyController())))
}
