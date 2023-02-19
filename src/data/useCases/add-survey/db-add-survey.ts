/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { AddSurvey, AddSurveyModel } from "../../../domain/useCases/add-survey"
import { serverError } from "../../../presentation/helper/http/httpHelper"
import { AddSurveyRepository } from "./db-add-survey-protocols"

export class DbAddSurvey implements AddSurvey {
    constructor (
        private readonly addSurveyRepository: AddSurveyRepository
    ) {}

    async add (data: AddSurveyModel): Promise<void> {
        try {
            await this.addSurveyRepository.add(data)
        } catch (error) {
            return serverError(error) as any
        }
    }
}
