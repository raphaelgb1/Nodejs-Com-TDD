import Joi from 'joi';
import { HttpRequest } from '../../presentation/protocols';
import { JoiValidator } from '../../validation/protocols/joi-validator';

export class JoiValidatorAdapter implements JoiValidator {
    constructor (private readonly object: Joi.Schema) {}
    checkSchema (object: HttpRequest) {
        return this.object.validate(object)
    }
}