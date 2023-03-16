import { SurveyModel } from "../../../../domain/models/survey-model"

export interface LoadSurveyRepository {
    loadAll (): Promise<SurveyModel[]>
}
