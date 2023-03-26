import { SurveyModel } from "../../models/survey-model"

export interface LoadSurveyById {
    loadBySurveyId (id: String): Promise<SurveyModel>
}
