import { LogErrorRepository } from "../../../../data/protocols/log-error-repository"
import { MongoHelper } from "../helpers/mongodb-helper"

export class LogMongoRepository implements LogErrorRepository {
    async logError (code: number, stack: string): Promise<void> {
        const errorCollection = await MongoHelper.getCollection('errors')
        await errorCollection.insertOne({
            code,
            stack,
            date: new Date()
        })
    }
}
