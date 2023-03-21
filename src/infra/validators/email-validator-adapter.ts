import validator from 'validator'
import { EmailValidator } from "@/validation/protocols/emailValidator"

export class EmailValidatorAdapter implements EmailValidator {
    isValid (email: string): boolean {
        return validator.isEmail(email)
    }
}
