const app = require('./app');
const connectDatabase = require('./config/database')


const dotenv = require('dotenv');



dotenv.config({path: 'backend/config/config.env'})

process.on('uncaughtException',err => {
    conso.log(`Error: ${err.stack}`);
    console.log('shutting down the server due to uncaughtException');
    server.close(() => { 
        process.exit(1);
    })

})


connectDatabase();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('shutting down the server due to Unhandled Promise rejection');
    server.close(() => { 
        process.exit(1);
    })
}) 