import { DBbAddAccount } from "../../../../data/useCases/addAccount/db-add-account"
import { BcryptAdapter } from "../../../../infra/criptography/bcrypter-adapter/bcrypt-adapter"
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository"
import { LogMongoRepository } from "../../../../infra/db/mongodb/log/log-mongo-repository"
import { SignUpController } from "../../../../presentation/controllers/signup/signup-controller"
import env from "../../../config/env"
import LogControllerDecorator from "../../../decorators/log-controller-decorator"
import { makeDbAuthentication } from "../../use-cases/authentication/db-authentication-factory"
import { makeSignUpValidation } from "./signup-validation-factory"

export const makeSignUpController = (): LogControllerDecorator => {
    const bcryptAdapter = new BcryptAdapter(parseInt(env.salt as any))
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DBbAddAccount(bcryptAdapter, accountMongoRepository)
    const validationComposite = makeSignUpValidation()
    const signUpController = new SignUpController(dbAddAccount, validationComposite, makeDbAuthentication())
    const logErrorRepository = new LogMongoRepository()
    const decorator = new LogControllerDecorator(signUpController, logErrorRepository)
    return decorator
}
