import { DbSaveSurveyResult } from "@/data/useCases/survey-result/save-survey-result/db-save-survey-result"
import { SaveSurveyResult } from "@/domain/useCases/survey-result/save-survey-result"
import { SurveyResultMongoRepository } from "@/infra/db/mongodb/survey-result/survey-result-mongo-repository"

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
    const surveyLoadRepository = new SurveyResultMongoRepository()
    const dbLoadAccount = new DbSaveSurveyResult(surveyLoadRepository)
    return dbLoadAccount
}
