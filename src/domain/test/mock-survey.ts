import { SurveyModel } from '@/domain/models/survey-model';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { AddSurveyModel } from '@/domain/useCases/survey/add-survey';
import { SaveSurveyResultParams } from '../useCases/survey-result/save-survey-result';

export const mockSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }],
    date: new Date()
})

export const mockSurveyModel = (): SurveyModel => {
    return {
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    }
}

export const mockArrSurveyData = (): SurveyModel[] => {
    return [{
        id: 'any_id',
        question: 'any_question',
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }],
        date: new Date()
    }]
}

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
