import { AddSurveyRepository } from "@/data/useCases/survey/add-survey/db-add-survey-protocols"
import { LoadSurveyByIdRepository } from "@/data/useCases/survey/load-survey-by-id/db-load-survey-by-id.-protocols"
import { LoadSurveyRepository } from "@/data/useCases/survey/load-survey/db-load-surveys-protocols"

export interface SurveyMongoSignature extends AddSurveyRepository, LoadSurveyRepository, LoadSurveyByIdRepository {}
