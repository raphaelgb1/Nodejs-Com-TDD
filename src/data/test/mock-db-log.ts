import { LogErrorRepository } from "../protocols/db/log/log-error-repository"

export const mockLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepository implements LogErrorRepository {
        async logError (code: number, stack: string): Promise<void> {
            return await new Promise(resolve => resolve())
        }
    }
    return new LogErrorRepository()
}
