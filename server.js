const app = require('./app')
const dotenv = require('dotenv')
const connectDB = require('./config/database')

dotenv.config({path:'backend/config/config.env'})

// process.on('uncaughtException', err=> {
//     console.log("ERROR", err.message)
//     console.log("Shuttin Down Server due to uncaught exception")
//     process.exit(1)
// })
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack} `)
    console.log("Shutting down server due to uncauhgt exception ")
    process.exit(1)
})
connectDB()

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started at PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.stack}`)
    console.log('Shutting down the server due to unhandled rejection')
    server.close(()=> {process.exit(1)})
} )