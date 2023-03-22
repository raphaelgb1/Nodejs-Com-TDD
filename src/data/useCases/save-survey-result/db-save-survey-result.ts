import { SaveSurveyResultRespository } from "@/data/protocols/db/survey/save-survey-result-repository"
import { SurveyResultModel } from "@/domain/models/survey-result"
import { SaveSurveyResultModel } from "@/domain/useCases/save-survey-result"

export class DbSaveSurveyResult implements SaveSurveyResultRespository {
    constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRespository) {}

    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyResult = await this.saveSurveyResultRepository.save(data)
        return surveyResult
    }
}
