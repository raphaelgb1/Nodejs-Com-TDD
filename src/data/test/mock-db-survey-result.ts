import { mockSurveyResultModel } from "@/domain/test"
import { SaveSurveyResultParams, SaveSurveyResultRespository, SurveyResultModel } from "@/data/useCases/survey-result/save-survey-result/db-save-survey-result-protocols"

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRespository => {
    class SaveSurveyResultRepository implements SaveSurveyResultRepository {
        async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return await Promise.resolve(mockSurveyResultModel())
        }
    }
    return new SaveSurveyResultRepository()
}
