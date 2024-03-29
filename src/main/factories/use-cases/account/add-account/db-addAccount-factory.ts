import { DBbAddAccount } from "@/data/useCases/account/addAccount/db-add-account"
import { AddAccount } from "@/domain/useCases/account/add-account"
import { BcryptAdapter } from "@/infra/criptography/bcrypter-adapter/bcrypt-adapter"
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository"
import env from "@/main/config/env"

export const makeDbAddAccount = (): AddAccount => {
    const bcryptAdapter = new BcryptAdapter(parseInt(env.salt as any))
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DBbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
    return dbAddAccount
}
