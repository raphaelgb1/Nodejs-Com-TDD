import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongodb-helper'
import app from "@/main/config/app"
import env from '@/main/config/env'

let accountColleciont: Collection
describe('Login Routes', () => {
    beforeAll(async () => {
        await MongoHelper.open(String(process.env.MONGO_URL))
    })

    afterAll(async () => {
        await MongoHelper.close()
    })

    beforeEach(async () => {
        accountColleciont = await MongoHelper.getCollection('accounts')
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
    describe('POST /login', () => {
        test('Should return 200 on login', async () => {
            const password = await hash('123', parseInt(env.salt as any))
            await accountColleciont.insertOne({
                name: 'any_name',
                email: 'any_email@gmail.com',
                password
            })
            await request(app)
                .post('/api/login')
                .send({
                    email: 'any_email@gmail.com',
                    password: '123'
                })
                .expect(200)
        })

        test('Should return 401 on login', async () => {
            await request(app)
                .post('/api/login')
                .send({
                    email: 'any_email@gmail.com',
                    password: '123'
                })
                .expect(401)
        })
    })
})
