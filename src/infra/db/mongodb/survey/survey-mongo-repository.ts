import { AddSurveyModel, AddSurveyRepository } from '../../../../data/useCases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../helpers/mongodb-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyCollections = await MongoHelper.getCollection('surveys')
        await surveyCollections.insertOne(surveyData)
    }
}
