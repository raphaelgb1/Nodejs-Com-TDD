import { AddSurveyModel } from '@/data/useCases/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@/domain/models/survey-model'
import { ObjectId } from 'mongodb'
import { SurveyMongoSignature } from '../../interfaces/survey-mongo-signature'
import { MongoHelper } from '../helpers/mongodb-helper'

export class SurveyMongoRepository implements SurveyMongoSignature {
    async add (surveyData: AddSurveyModel): Promise<void> {
        const surveyCollections = await MongoHelper.getCollection('surveys')
        await surveyCollections.insertOne(surveyData)
    }

    async loadAll (): Promise<SurveyModel[]> {
        const surveyCollections = await MongoHelper.getCollection('surveys')
        const surveys = await surveyCollections.find().toArray()
        return MongoHelper.mapperCollection(surveys)
    }

    async loadById (id: string): Promise<SurveyModel> {
        const surveyCollections = await MongoHelper.getCollection('surveys')
        const surveys = await surveyCollections.findOne({ _id: new ObjectId(id) })
        return surveys && MongoHelper.mapper(surveys)
    }
}
