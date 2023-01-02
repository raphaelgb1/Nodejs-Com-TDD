export class ServerError extends Error {
    constructor (stack: string = 'Server Error') {
        super(`Internal Server Error`)
        this.name = 'ServerError'
        this.stack = stack
    }
}
