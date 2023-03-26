import { DbAuthentication } from "@/data/useCases/account/authentication/db-authentication"
import { Authentication } from "@/domain/useCases/account/authentication"
import { BcryptAdapter } from "@/infra/criptography/bcrypter-adapter/bcrypt-adapter"
import { JwtAdapter } from "@/infra/criptography/jwt-adapter/jwt-adapter"
import { AccountMongoRepository } from "@/infra/db/mongodb/account/account-mongo-repository"
import env from "@/main/config/env"

export const makeDbAuthentication = (): Authentication => {
    const bcryptAdapter = new BcryptAdapter(parseInt(env.salt as any))
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
    return dbAuthentication
}
