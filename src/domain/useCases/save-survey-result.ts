import { SurveyResultModel } from "../models/survey-result"

type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
    save (data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
