import { AuthMiddleware } from "@/presentation/middleware/auth-middleware"
import { Middleware } from "@/presentation/protocols"
import { makeDbLoadAccountByToken } from "../use-cases/account/load-account-by-token/db-load-accound-by-token-factory"

export const makeAuthMiddleware = (role?: string): Middleware => {
    const controller = new AuthMiddleware(makeDbLoadAccountByToken(), role)
    return controller
}
