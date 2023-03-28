import { SurveyResultModel } from "../models/survey-result"
import { SaveSurveyResultParams } from "../useCases/survey-result/save-survey-result"

export const mockSurveyResultData = (): SaveSurveyResultParams => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
    ...mockSurveyResultData(),
    id: 'any_id'
})
