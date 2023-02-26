import { Router } from "express"
import { adaptMiddleware } from "../adapters/express/express-middleware-adapter"
import { adaptRoute } from "../adapters/express/express-routes-adapter"
import { makeAddSurveyController } from "../factories/controllers/survey/add-survey/add-survey-controller-factory"
import { makeAuthMiddleware } from "../factories/middlewares/auth-middleware-factory"

export default async (router: Router): Promise<void> => {
    const adminAuth = await adaptMiddleware(makeAuthMiddleware())
    router.post('/surveys', adminAuth, (await adaptRoute(makeAddSurveyController())))
}
