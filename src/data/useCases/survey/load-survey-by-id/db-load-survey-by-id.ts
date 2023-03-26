import { LoadSurveyByIdRepository, SurveyModel, LoadSurveyById } from "./db-load-survey-by-id.-protocols"

export class DbLoadSurveyById implements LoadSurveyById {
    constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

    async loadBySurveyId (id: string): Promise<SurveyModel | any> {
        const survey = await this.loadSurveyByIdRepository.loadById(id)
        return survey
    }
}
