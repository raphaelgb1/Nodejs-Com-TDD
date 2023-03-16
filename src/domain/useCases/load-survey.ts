import { SurveyModel } from "../models/survey-model"

export interface LoadSurvey {
    load (): Promise<SurveyModel[]>
}
