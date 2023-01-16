import { DBbAddAccount } from "../../data/useCases/addAccount/db-add-account"
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter"
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account"
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log"
import { SignUpController } from "../../presentation/controllers/signup"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter"
import LogControllerDecorator from "../decorators/log"

export const makeSignUpController = (): LogControllerDecorator => {
    const salt = 12
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DBbAddAccount(bcryptAdapter, accountMongoRepository)
    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
    const logErrorRepository = new LogMongoRepository()
    const decorator = new LogControllerDecorator(signUpController, logErrorRepository)
    return decorator
}
