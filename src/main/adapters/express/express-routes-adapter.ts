import { Controller, HttpRequest } from "@/presentation/protocols"
import { Request, Response } from "express"

export const adaptRoute = async (controller: Controller): Promise<any> => {
    const anyFunction = async (req: Request, res: Response): Promise<void> => {
        const httpRequest: HttpRequest = {
            body: req.body,
            params: req.params,
            accountId: req.accountId
        }
        const httpResponse = await controller.handle(httpRequest)
        if ([200, 204].includes(httpResponse.statusCode)) {
            res.status(httpResponse.statusCode).json(httpResponse.body)
        } else {
            res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
        }
    }
    return anyFunction
}
