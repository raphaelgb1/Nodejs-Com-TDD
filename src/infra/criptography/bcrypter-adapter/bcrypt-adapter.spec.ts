import bcrypt from 'bcrypt'
import env from '../../../main/config/env'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return await new Promise(resolve => resolve('hash'))
    },

    async compare (): Promise<boolean> {
        return await new Promise(resolve => resolve(true))
    }
}))

const salt = parseInt(env.salt as any)
const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should throw if hash throws', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })// SOLUÇÃO ALTERNATIVA
        const promise = sut.hash('any_value')
        await expect(promise).rejects.toThrow()
    })

    test('Should return a valid hash on hash success', async () => {
        const sut = makeSut()
        const promise = await sut.hash('any_value')
        expect(promise).toBe('hash')
    })

    test('Should call compare with correct values', async () => {
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare('any_value', 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeds', async () => {
        const sut = makeSut()
        const isValid = await sut.compare('any_value', 'any_hash')
        expect(isValid).toBe(true)
    })

    test('Should return false when compare fails', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(await new Promise(resolve => resolve(false as any)))
        const isValid = await sut.compare('any_value', 'any_hash')
        expect(isValid).toBe(false)
    })

    test('Should throw if comapre throws', async () => {
        const sut = makeSut()
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })// SOLUÇÃO ALTERNATIVA
        const promise = sut.compare('any_value', 'any_value')
        await expect(promise).rejects.toThrow()
    })
})
