import { Decrypter } from '../../../data/protocols/criptografy/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
}

const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
        async decrypt (value: string): Promise<string> {
            return await Promise.resolve('any_value')
        }
    }
    return new DecrypterStub()
}

const makeSut = (role?: string): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub)
    return {
        sut,
        decrypterStub
    }
}

describe('Db Load Account by Token UseCase', () => {
    test('Should call decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut()
        const loadSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token')
        expect(loadSpy).toHaveBeenCalledWith('any_token')
    })
})
