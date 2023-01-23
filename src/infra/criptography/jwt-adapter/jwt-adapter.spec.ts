import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

describe('Jason Web Token Adapter', () => {
    interface SutTypes {
        sut: JwtAdapter
    }

    const makeSut = (): SutTypes => {
        const sut = new JwtAdapter('secret')
        return {
            sut
        }
    }

    const makeObj = (): any => ({ id: 'any_id' })

    test('Should call sing with correct values', async () => {
        const { sut } = makeSut()
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt(makeObj().id)
        expect(signSpy).toHaveBeenCalledWith(makeObj(), 'secret')
    })
})
