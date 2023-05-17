const mongoose = require('mongoose')


const connectDB = () => {
        mongoose.connect(process.env.DB_LOCAL_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(con=> {
            console.log(`MongodB connected`)
        })
}

module.exports =connectDB