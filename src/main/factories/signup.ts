import { DBbAddAccount } from "../../data/useCases/addAccount/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log"
import { SignUpController } from "../../presentation/controllers/signup/signup"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter"
import LogControllerDecorator from "../decorators/log"
import { makeSignUpValidation } from "./signup-validation"

export const makeSignUpController = (): LogControllerDecorator => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DBbAddAccount(bcryptAdapter, accountMongoRepository)
    const validationComposite = makeSignUpValidation()
    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, validationComposite)
    const logErrorRepository = new LogMongoRepository()
    const decorator = new LogControllerDecorator(signUpController, logErrorRepository)
    return decorator
}
