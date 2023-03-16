export interface SurveyModel {
    id: String
    question: string
    answers: SurveyAnswerModel[]
    date: Date
}

export interface SurveyAnswerModel {
    image?: string
    answer: string
}
