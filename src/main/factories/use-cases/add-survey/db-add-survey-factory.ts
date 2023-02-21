import { DbAddSurvey } from "../../../../data/useCases/add-survey/db-add-survey"
import { AddSurvey } from "../../../../domain/useCases/add-survey"
import { SurveyMongoRepository } from "../../../../infra/db/mongodb/survey/survey-mongo-repository"

export const makeDbAddSurvey = (): AddSurvey => {
    const surveyAddRepository = new SurveyMongoRepository()
    const dbAddAccount = new DbAddSurvey(surveyAddRepository)
    return dbAddAccount
}
