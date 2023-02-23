import { LoadAccountByToken } from "../../../domain/useCases/load-account-by-token"
import { Decrypter } from "../../protocols/criptografy/decrypter"
import { AccountModel } from "../addAccount/db-add-account-protocols"

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor (
        private readonly decrypter: Decrypter
    ) {}

    async load (accessToken: string, role?: string | undefined): Promise<AccountModel> {
        this.decrypter.decrypt(accessToken)
        return await Promise.resolve(null as any)
    }
}
