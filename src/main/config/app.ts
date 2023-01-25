import express from 'express'
import setUpMiddlewares from './middlewares'
import setUpRoutes from './routes'
import * as env from 'dotenv'

const app = express()
env.config()
setUpMiddlewares(app)
setUpRoutes(app)
export default app
