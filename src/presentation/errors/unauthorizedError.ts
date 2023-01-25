export class UnauthorizedError extends Error {
    constructor () {
        super(`Unauthorized Access - Check User and Password`)
        this.name = 'UnauthorizedError'
    }
}
