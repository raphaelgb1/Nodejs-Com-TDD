import request from 'supertest'
import app from "@/main/config/app"

describe('Body Parser Middleware', () => {
    test('Should parse Body as Json', async () => {
        app.post('/test_body_parser', (req, res) => {
            res.send(req.body)
        })

        await request(app)
            .post('/test_body_parser')
            .send({ name: 'Raphael' })
            .expect({ name: 'Raphael' })
    })
})
