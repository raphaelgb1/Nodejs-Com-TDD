import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
    sign: async (): Promise<string> => {
        return await new Promise(resolve => resolve('any_token'))
    }
}))

describe('Jason Web Token Adapter', () => {
    const makeSut = (): JwtAdapter => {
        return new JwtAdapter('secret')
    }

    const makeObj = (): any => ({ id: 'any_id' })

    test('Should call sing with correct values', async () => {
        const sut = makeSut()
        const signSpy = jest.spyOn(jwt, 'sign')
        const data = makeObj()
        await sut.encrypt(data.id)
        expect(signSpy).toHaveBeenCalledWith(data, 'secret')
    })

    test('Should return a token on sign success', async () => {
        const sut = makeSut()
        const data = makeObj()
        const accessToken = await sut.encrypt(data.id)
        expect(accessToken).toBe('any_token')
    })

    test('Should throw if JWT throws', async () => {
        const sut = makeSut()
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.encrypt(makeObj().id)
        await expect(promise).rejects.toThrow()
    })
})
