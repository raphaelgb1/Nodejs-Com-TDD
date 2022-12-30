import { MongoHelper } from "../infra/db/mongodb/helpers/mongodb-helper"
import env from "./config/env"

MongoHelper.open(String(env.mongoUrl))
    .then(async () => {
        const app = (await import('./config/app')).default
        app.listen(env.port, () => console.log(`Server running in port: ${env.port}`))
    }).catch(error => {
        console.log(error)
    })
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
