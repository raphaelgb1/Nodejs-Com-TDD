import { SurveyModel } from "@/domain/models/survey-model"
import { AddSurveyModel } from "@/domain/useCases/survey/add-survey"

export const mockSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }],
    date: new Date()
})

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
