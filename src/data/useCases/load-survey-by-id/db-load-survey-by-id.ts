import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository"
import { SurveyModel } from "@/domain/models/survey-model"
import { LoadSurveyById } from "@/domain/useCases/load-survey -by-id"

export class DbLoadSurveyById implements LoadSurveyById {
    constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

    async loadBySurveyId (id: String): Promise<SurveyModel | any> {
        const survey = await this.loadSurveyByIdRepository.loadById(id)
        return survey
    }
}
