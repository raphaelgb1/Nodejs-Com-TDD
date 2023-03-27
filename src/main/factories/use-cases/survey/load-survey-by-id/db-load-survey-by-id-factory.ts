import { DbLoadSurveyById } from "@/data/useCases/survey/load-survey-by-id/db-load-survey-by-id"
import { LoadSurveyById } from "@/domain/useCases/survey/load-survey-by-id"
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository"

export const makeDbLoadSurveyById = (): LoadSurveyById => {
    const surveyLoadRepository = new SurveyMongoRepository()
    const dbLoadAccount = new DbLoadSurveyById(surveyLoadRepository)
    return dbLoadAccount
}
