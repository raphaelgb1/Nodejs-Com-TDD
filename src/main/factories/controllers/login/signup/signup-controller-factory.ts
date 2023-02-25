import { SignUpController } from "../../../../../presentation/controllers/login/signup/signup-controller"
import { Controller } from "../../../../../presentation/protocols"
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator"
import { makeDbAddAccount } from "../../../use-cases/account/add-account/db-addAccount-factory"
import { makeDbAuthentication } from "../../../use-cases/account/authentication/db-authentication-factory"
import { makeSignUpValidation } from "./signup-validation-factory"

export const makeSignUpController = (): Controller => {
    const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
    return makeLogControllerDecorator(signUpController)
}
