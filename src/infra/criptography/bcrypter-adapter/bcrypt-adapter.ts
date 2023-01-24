import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/criptografy/hash-comparer'
import { Hasher } from "../../../data/protocols/criptografy/hasher"

export class BcryptAdapter implements Hasher, HashComparer {
    constructor (private readonly salt: number) {}

    async hash (value: string): Promise<string> {
        const hashValue = await bcrypt.hash(value, this.salt)
        return hashValue
    }

    async compare (value: string, hash: string): Promise<boolean> {
        const isValid = await bcrypt.compare(value, hash)
        return isValid
    }
}
