import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository"
import { SaveSurveyResultRespository } from "@/data/protocols/db/survey-result/save-survey-result-repository"
import { AddSurveyModel } from "@/data/useCases/survey/add-survey/db-add-survey-protocols"
import { mockArrSurveyData, mockSurveyModel, mockSurveyResultModel } from "@/domain/test"
import { SaveSurveyResultParams, SurveyResultModel } from "@/data/useCases/survey-result/save-survey-result/db-save-survey-result-protocols"
import { LoadSurveyRepository } from "@/data/protocols/db/survey/load-survey-repository"
import { LoadSurveyByIdRepository } from "@/data/protocols/db/survey/load-survey-by-id-repository"
import { SurveyModel } from "../useCases/survey/load-survey/db-load-surveys-protocols"

export const mockAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepository implements AddSurveyRepository {
        async add (surveyData: AddSurveyModel): Promise<void> {
            return await Promise.resolve()
        }
    }
    return new AddSurveyRepository()
}

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRespository => {
    class SaveSurveyResultRepository implements SaveSurveyResultRespository {
        async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
            return await Promise.resolve(mockSurveyResultModel())
        }
    }
    return new SaveSurveyResultRepository()
}

export const mockLoadSurveyRepository = (): LoadSurveyRepository => {
    class LoadSurveyRepository implements LoadSurveyRepository {
        async loadAll (): Promise<SurveyModel[]> {
            return await Promise.resolve(mockArrSurveyData())
        }
    }

    return new LoadSurveyRepository()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepository implements LoadSurveyByIdRepository {
        async loadById (): Promise<SurveyModel> {
            return await Promise.resolve(mockSurveyModel())
        }
    }

    return new LoadSurveyByIdRepository()
}
