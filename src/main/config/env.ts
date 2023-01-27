export default {
    mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongo:27017/node-com-tdd',
    port: process.env.PORT ?? 5050,
    jwtSecret: process.env.JWT_SECRET ?? 'tj670',
    salt: process.env.SALT ?? 12
}
