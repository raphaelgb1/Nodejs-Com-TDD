import { AddSurveyModel } from "../../../../domain/useCases/add-survey"

export interface AddSurveyRepository {
    add (accountData: AddSurveyModel): Promise<void>
}
