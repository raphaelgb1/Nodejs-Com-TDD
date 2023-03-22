import { AddAccountRepository } from "@/data/useCases/addAccount/db-add-account-protocols"
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from "@/data/useCases/authentication/db-authentication-protocols"
import { LoadAccountByTokenRepository } from "@/data/useCases/load-account-by-token/db-load-account-by-token-protocols"

export interface AccountMongoSignature extends AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {}
