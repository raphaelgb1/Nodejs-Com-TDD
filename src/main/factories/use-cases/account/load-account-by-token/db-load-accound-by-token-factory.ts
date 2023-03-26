import { DbLoadAccountByToken } from "@/data/useCases/account/load-account-by-token/db-load-account-by-token"
import { LoadAccountByToken } from "@/domain/useCases/account/load-account-by-token"
import { JwtAdapter } from "@/infra/criptography/jwt-adapter/jwt-adapter"
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository"
import env from "@/main/config/env"

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
    return dbAddAccount
}
