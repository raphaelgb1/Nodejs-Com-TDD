import { SurveyModel } from "../models/survey-model"

export interface LoadSurveyById {
    loadById (id: String): Promise<SurveyModel>
}
