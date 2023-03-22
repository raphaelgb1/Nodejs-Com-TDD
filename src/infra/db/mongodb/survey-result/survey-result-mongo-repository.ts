import { SaveSurveyResultModel, SaveSurveyResultRespository, SurveyResultModel } from "@/data/useCases/save-survey-result/db-save-survey-result-protocols"
import { MongoHelper } from "../helpers/mongodb-helper"

export class SurveyResultMongoRepository implements SaveSurveyResultRespository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        const surveyResultCollections = await MongoHelper.getCollection('surveyResults')
        const collums = { $set: { answer: data.answer, date: data.date } }
        const result = await surveyResultCollections.findOneAndUpdate({
            surveyId: data.surveyId, accountId: data.accountId
        }, collums, { upsert: true, returnDocument: "after" })

        return result && MongoHelper.mapper(result.value)
    }
}
