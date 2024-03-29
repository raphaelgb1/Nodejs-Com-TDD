import { ServerError } from "@/presentation/errors"
import { UnauthorizedError } from "@/presentation/errors/unauthorizedError"
import { HttpResponse } from "@/presentation/protocols/http"

export const badRequest = (error: Error): HttpResponse => ({
        statusCode: 400,
        body: error
})

export const serverError = (error: any): HttpResponse => ({
        statusCode: 500,
        body: new ServerError(error.stack)
})

export const responseOk = (data: any): HttpResponse => ({
        statusCode: 200,
        body: data
})

export const unauthorized = (): HttpResponse => ({
        statusCode: 401,
        body: new UnauthorizedError()
})

export const forbbiden = (error: Error): HttpResponse => ({
        statusCode: 403,
        body: error
})

export const noContent = (): HttpResponse => ({
        statusCode: 204,
        body: null
})
