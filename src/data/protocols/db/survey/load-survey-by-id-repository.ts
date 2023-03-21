import { SurveyModel } from "@/domain/models/survey-model"

export interface LoadSurveyByIdRepository {
    loadById (id: String): Promise<SurveyModel>
}
