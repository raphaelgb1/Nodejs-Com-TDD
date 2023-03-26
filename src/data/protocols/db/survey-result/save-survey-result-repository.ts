import { SurveyResultModel } from "@/domain/models/survey-result"
import { SaveSurveyResultModel } from "@/domain/useCases/survey-result/save-survey-result"

export interface SaveSurveyResultRespository {
    save (data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
