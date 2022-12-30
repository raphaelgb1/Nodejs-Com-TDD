import { Controller, HttpRequest } from "../../presentation/protocols"
import { Request, Response } from "express"

export const adaptRoute = async (controller: Controller): Promise<any> => {
    const anyFunction = async (req: Request, res: Response): Promise<any> => {
        const httpRequest: HttpRequest = {
            body: req.body
        }
        const httpResponse = await controller.handle(httpRequest)
        res.status(httpResponse.statusCode).json(httpResponse.body)
    }
    return anyFunction
}
