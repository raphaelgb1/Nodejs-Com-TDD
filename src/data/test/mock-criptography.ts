import { Decrypter } from "../protocols/criptografy/decrypter"
import { Encrypter } from "../protocols/criptografy/encrypter"
import { HashComparer } from "../protocols/criptografy/hash-comparer"
import { Hasher } from "../protocols/criptografy/hasher"

export const mockHasher = (): Hasher => {
    class Hasher implements Hasher {
      async hash (value: string): Promise<string> {
          return await Promise.resolve('hashed_password')
      }
    }
    return new Hasher()
}

export const mockDecrypter = (): Decrypter => {
    class Decrypter implements Decrypter {
        async decrypt (value: string): Promise<string> {
            return await Promise.resolve('any_value')
        }
    }
    return new Decrypter()
}

export const mockHashComparer = (): HashComparer => {
    class HashCompare implements HashComparer {
        async compare (password: string, hash: string): Promise<boolean> {
            return true
        }
    }
    return new HashCompare()
}

export const mockEncrypter = (): Encrypter => {
    class Encrypter implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return await Promise.resolve('any_token')
        }
    }
    return new Encrypter()
}
