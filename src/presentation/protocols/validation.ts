import { JoiValidatorModel } from "../../validation/protocols/joi-validator-model";

export interface Validation {
    validate (input: any, object?: JoiValidatorModel): Error
}
