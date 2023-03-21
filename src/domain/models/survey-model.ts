export type SurveyModel = {
    id: String
    question: string
    answers: SurveyAnswerModel[]
    date: Date
}

export type SurveyAnswerModel = {
    image?: string
    answer: string
}
