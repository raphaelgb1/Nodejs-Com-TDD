import { DbLoadSurvey } from "@/data/useCases/load-survey/db-load-survey"
import { LoadSurvey } from "@/domain/useCases/load-survey"
import { SurveyMongoRepository } from "@/infra/db/mongodb/survey/survey-mongo-repository"

export const makeDbLoadSurvey = (): LoadSurvey => {
    const surveyLoadRepository = new SurveyMongoRepository()
    const dbLoadAccount = new DbLoadSurvey(surveyLoadRepository)
    return dbLoadAccount
}
