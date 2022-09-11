export class ServerError extends Error {
    constructor (paramName: string = 'Server Error') {
        super(`Internal Server Error`)
        this.name = paramName
    }
}
