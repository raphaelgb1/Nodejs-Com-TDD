export class UnauthorizedError extends Error {
    constructor () {
        super(`Unauthorized Acess`)
        this.name = 'UnauthorizedError'
    }
}
