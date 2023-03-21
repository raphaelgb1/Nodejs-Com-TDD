import { NextFunction, Request, Response } from "express"
import { Controller, HttpRequest } from "@/presentation/protocols"

export const adaptMiddleware = async (controller: Controller): Promise<any> => {
    const anyFunction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const httpRequest: HttpRequest = {
            headers: req.headers
        }
        const httpResponse = await controller.handle(httpRequest)
        if ([200].includes(httpResponse.statusCode)) {
            Object.assign(req, httpResponse.body)
            next()
        } else {
            res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
        }
    }
    return anyFunction
}
