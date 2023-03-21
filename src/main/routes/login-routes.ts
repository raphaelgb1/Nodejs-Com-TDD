import { Router } from "express"
import { adaptRoute } from "@/main/adapters/express/express-routes-adapter"
import { makeLoginController } from "@/main/factories/controllers/login/login/login-controller-factory"
import { makeSignUpController } from "@/main/factories/controllers/login/signup/signup-controller-factory"

export default async (router: Router): Promise<void> => {
    router.post('/signup', (await adaptRoute(makeSignUpController())))
    router.post('/login', (await adaptRoute(makeLoginController())))
}
