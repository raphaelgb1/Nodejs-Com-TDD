import { HttpRequest } from "@/presentation/protocols";

export const mockRequest = (): HttpRequest => ({
    body: {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
})

export const mockRequestDesigned = (type: string | number = "0"): HttpRequest => {
    const email = 'any_email@gmail.com'
    const password = 'any_password'
    const ob = {
        0: { body: { email } },
        1: { body: { password } },
        2: { body: { email, password } },
        3: { email, password }
    }
    return ob[type]
}

export const mockRequestParam = (): HttpRequest => ({
    params: {
        surveyId: 'any_survey_id'
    },
    body: { answer: 'any_answer' },
    accountId: 'any_account_id'
})

export const mockHeaders = (): HttpRequest => ({
    headers: {
        'x-access-token': 'any_token'
    }
})
