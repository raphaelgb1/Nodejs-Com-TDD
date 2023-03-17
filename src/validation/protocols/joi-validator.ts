import { HttpRequest } from "../../presentation/protocols";

export interface JoiValidator {
    checkSchema (object: HttpRequest): any
  }
