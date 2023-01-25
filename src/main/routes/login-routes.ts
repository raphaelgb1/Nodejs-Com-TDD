import { Router } from "express"
import { adaptRoute } from "../adapters/express/express-routes-adapter"
import { makeSignUpController } from "../factories/signup/signup-factory"

export default async (router: Router): Promise<void> => {
    router.post('/signup', (await adaptRoute(makeSignUpController())))
}
