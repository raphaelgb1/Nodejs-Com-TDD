import { SaveSurveyResultParams, SaveSurveyResultRespository, SurveyResultModel } from "./db-save-survey-result-protocols"

export class DbSaveSurveyResult implements SaveSurveyResultRespository {
    constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRespository) {}

    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        const surveyResult = await this.saveSurveyResultRepository.save(data)
        return surveyResult
    }
}
