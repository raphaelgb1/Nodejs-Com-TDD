import { LoadSurveyRepository } from '@/data/protocols/db/survey/load-survey-repository'
import { AddSurveyModel, AddSurveyRepository } from '@/data/useCases/add-survey/db-add-survey-protocols'
import { LoadSurveyByIdRepository } from '@/data/useCases/load-survey-by-id/db-load-survey-by-id.-protocols'
import { SurveyModel } from '@/domain/models/survey-model'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongodb-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository, LoadSurveyByIdRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyCollections = await MongoHelper.getCollection('surveys')
        await surveyCollections.insertOne(surveyData)
    }

    async loadAll (): Promise<SurveyModel[]> {
        const surveyCollections = await MongoHelper.getCollection('surveys')
        const surveys = await surveyCollections.find().toArray()
        return surveys as unknown as SurveyModel[]
    }

    async loadById (id: string): Promise<SurveyModel> {
        const surveyCollections = await MongoHelper.getCollection('surveys')
        const surveys = await surveyCollections.findOne({ _id: new ObjectId(id) })
        return surveys as unknown as SurveyModel
    }
}
