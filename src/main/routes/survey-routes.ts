import { Router } from "express"
import { adaptRoute } from "@/main/adapters/express/express-routes-adapter"
import { makeAddSurveyController } from "@/main/factories/controllers/survey/add-survey/add-survey-controller-factory"
import { makeLoadSurveyController } from "@/main/factories/controllers/survey/load-survey/load-survey-controller-factory"
import { adminAuth } from "@/main/middlewares/admin-auth"
import { auth } from "@/main/middlewares/auth"

export default async (router: Router): Promise<void> => {
    router.post('/surveys', await adminAuth, (await adaptRoute(makeAddSurveyController())))
    router.get('/surveys', await auth, (await adaptRoute(makeLoadSurveyController())))
}
