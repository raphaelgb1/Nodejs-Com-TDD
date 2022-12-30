import { Router } from "express"
import { adaptRoute } from "../adapters/express-routes-adapter"
import { makeSignUpController } from "../factories/signup"

export default async (router: Router): Promise<void> => {
    router.post('/signup', (await adaptRoute(makeSignUpController())))
}
