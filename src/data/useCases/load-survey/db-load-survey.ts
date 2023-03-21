import { SurveyModel, LoadSurvey, LoadSurveyRepository } from "./db-load-surveys-protocols"

export class DbLoadSurvey implements LoadSurvey {
    constructor (private readonly loadSurveyRepository: LoadSurveyRepository) {}
    async load (): Promise<SurveyModel[]> {
        const surveys = await this.loadSurveyRepository.loadAll()
        return surveys
    }
}
