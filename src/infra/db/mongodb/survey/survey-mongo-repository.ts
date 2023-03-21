import { LoadSurveyRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { AddSurveyModel, AddSurveyRepository } from '@/data/useCases/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@/domain/models/survey-model'
import { MongoHelper } from '../helpers/mongodb-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyCollections = await MongoHelper.getCollection('surveys')
        await surveyCollections.insertOne(surveyData)
    }

    async loadAll (): Promise<SurveyModel[]> {
        const surveyCollections = await MongoHelper.getCollection('surveys')
        const surveys = await surveyCollections.find().toArray()
        return surveys as unknown as SurveyModel[]
    }
}
