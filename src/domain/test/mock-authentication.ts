import { AuthenticationParams } from "@/domain/useCases/account/authentication";

export const mockAuthentication = (): AuthenticationParams => ({
    email: 'any_email@gmail.com',
    password: 'any_password'
})
