import { DBbAddAccount } from "../../../../data/useCases/addAccount/db-add-account"
import { AddAccount } from "../../../../domain/useCases/add-account"
import { BcryptAdapter } from "../../../../infra/criptography/bcrypter-adapter/bcrypt-adapter"
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository"
import env from "../../../config/env"

export const makeDbAddAccount = (): AddAccount => {
    const bcryptAdapter = new BcryptAdapter(parseInt(env.salt as any))
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DBbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
    return dbAddAccount
}
