import { SurveyModel } from "../../../domain/models/survey-model"
import { LoadSurvey } from "../../../domain/useCases/load-survey"
import { LoadSurveyRepository } from "../../protocols/db/survey/load-survey-repository"

export class DbLoadSurvey implements LoadSurvey {
    constructor (private readonly loadSurveyRepository: LoadSurveyRepository) {}
    async load (): Promise<SurveyModel[]> {
        const surveys = await this.loadSurveyRepository.loadAll()
        return surveys
    }
}
