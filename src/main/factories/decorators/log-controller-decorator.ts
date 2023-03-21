import { LogMongoRepository } from "@/infra/db/mongodb/log/log-mongo-repository"
import { Controller } from "@/presentation/protocols"
import LogControllerDecorator from "@/main/decorators/log-controller-decorator"

export const makeLogControllerDecorator = (controller: Controller): Controller => {
    const logMongoRepository = new LogMongoRepository()
    const logControllerDecorator = new LogControllerDecorator(controller, logMongoRepository)
    return logControllerDecorator
}
