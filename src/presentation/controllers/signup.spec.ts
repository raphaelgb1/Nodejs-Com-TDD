import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provide', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: '',
        email: '',
        password: 'pass',
        passwordConfirmation: 'pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing Name: param'))
  })
})
