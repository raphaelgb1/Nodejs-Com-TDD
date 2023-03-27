import { AccountModel } from "../models/account"
import { SurveyModel } from "../models/survey-model"
import { AddAccountParams } from "../useCases/account/add-account"
import { AuthenticationParams } from "../useCases/account/authentication"
import { AddSurveyModel } from "../useCases/survey/add-survey"

export const mockAccountModel = (type = 0): AccountModel => {
    const typeName = type === 0 ? 'any' : 'valid'
    return {
        id: `${typeName}_id`,
        name: `${typeName}_name`,
        email: `${typeName}_email@email.com`,
        password: `${typeName}_password`
    }
}

export const mockAccountParams = (): AddAccountParams => ({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
})

export const mockName = (): unknown => ({
    name: 'Raphael'
})

export const mockAuthentication = (): AuthenticationParams => ({
    email: 'any_email@gmail.com',
    password: 'any_password'
})

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
