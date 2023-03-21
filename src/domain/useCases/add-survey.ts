import { SurveyAnswerModel } from "../models/survey-model"

export type AddSurveyModel = {
    question: string
    answers: SurveyAnswerModel[]
    date: Date
}
export interface AddSurvey {
    add (data: AddSurveyModel): Promise<void>
}
