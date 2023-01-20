import bcrypt from 'bcrypt'
import { Encrypter } from "../../data/protocols/criptografy/encrypter"

export class BcryptAdapter implements Encrypter {
    private readonly salt: number

    constructor (salt: number) {
        this.salt = salt
    }

    async encrypt (value: string): Promise<string> {
        const hashValue = await bcrypt.hash(value, this.salt)
        return hashValue
    }
}
