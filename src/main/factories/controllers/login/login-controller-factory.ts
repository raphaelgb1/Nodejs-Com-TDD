import { LogMongoRepository } from "../../../../infra/db/mongodb/log/log-mongo-repository"
import { LoginController } from "../../../../presentation/controllers/login/login-controller"
import { Controller } from "../../../../presentation/protocols"
import LogControllerDecorator from "../../../decorators/log-controller-decorator"
import { makeDbAuthentication } from "../../use-cases/authentication/db-authentication-factory"
import { makeLoginValidation } from "./login-validation-factory"

export const makeLoginController = (): Controller => {
    const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation())
    const logMongoRepository = new LogMongoRepository()
    return new LogControllerDecorator(loginController, logMongoRepository)
}
