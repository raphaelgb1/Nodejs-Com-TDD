import { AddAccountRepository } from "@/data/useCases/account/addAccount/db-add-account-protocols"
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from "@/data/useCases/account/authentication/db-authentication-protocols"
import { LoadAccountByTokenRepository } from "@/data/useCases/account/load-account-by-token/db-load-account-by-token-protocols"

export interface AccountMongoSignature extends AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {}
