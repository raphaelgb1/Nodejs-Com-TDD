import { AddSurveyRepository } from "@/data/useCases/add-survey/db-add-survey-protocols"
import { LoadSurveyByIdRepository } from "@/data/useCases/load-survey-by-id/db-load-survey-by-id.-protocols"
import { LoadSurveyRepository } from "@/data/useCases/load-survey/db-load-surveys-protocols"

export interface SurveyMongoSignature extends AddSurveyRepository, LoadSurveyRepository, LoadSurveyByIdRepository {}
