import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongodb-helper'
import app from "../config/app"

describe('Login Routes', () => {
    beforeAll(async () => {
        await MongoHelper.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await MongoHelper.close()
    })

    beforeEach(async () => {
        const accountColleciont = await MongoHelper.getCollection('accounts')
        await accountColleciont.deleteMany({})
    })

    describe('POST /signup', () => {
        test('Should return 200 on signup', async () => {
            await request(app)
                .post('/api/signup')
                .send({
                    name: 'any_name',
                    email: 'any_email@gmail.com',
                    password: 'any_password',
                    passwordConfirmation: 'any_password'
                })
                .expect(200)
        })
    })
})
