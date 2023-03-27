import { adaptRoute } from "@/main/adapters/express/express-routes-adapter"
import { auth } from "@/main/middlewares/auth"
import { Router } from "express"
import { makeSaveSurveyResultController } from "../factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory"

export default async (router: Router): Promise<void> => {
    router.put('/surveys/:surveyId/results', await auth, (await adaptRoute(makeSaveSurveyResultController())))
}
