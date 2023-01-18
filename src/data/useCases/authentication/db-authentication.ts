import { Authentication, AuthenticationModel } from "../../../domain/useCases/authentication"
import { badRequest } from "../../../presentation/helper/http/httpHelper"
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository"

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

    constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async auth (authentication: AuthenticationModel): Promise<any> {
        const error = await this.loadAccountByEmailRepository.load(authentication.email)
        if (error) {
            return badRequest(new Error())
        }
        return 'null'
    }
}
