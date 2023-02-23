import { LoadAccountByToken } from "../../../domain/useCases/load-account-by-token"
import { Decrypter } from "../../protocols/criptografy/decrypter"
import { LoadAccountByTokenRepository } from "../../protocols/db/account/load-accountby-token-repository"
import { AccountModel } from "../addAccount/db-add-account-protocols"

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor (
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
    ) {}

    async load (accessToken: string, role?: string | undefined): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)
        if (token) {
            const account = await this.loadAccountByTokenRepository.loadByToken(token, role)
            if (account) {
                return account
            }
        }
        return null as any
    }
}