export interface LogErrorRepository {
    logError (code: number, stack: string): Promise<void>
}
