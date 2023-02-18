import { Router } from "express"
import { adaptRoute } from "../adapters/express/express-routes-adapter"
import { makeLoginController } from "../factories/controllers/login/login-controller-factory"
import { makeSignUpController } from "../factories/controllers/signup/signup-controller-factory"

export default async (router: Router): Promise<void> => {
    router.post('/signup', (await adaptRoute(makeSignUpController())))
    router.post('/login', (await adaptRoute(makeLoginController())))
}
