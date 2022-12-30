export default {
    mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/node-com-tdd',
    port: process.env.PORT ?? 5050
}
