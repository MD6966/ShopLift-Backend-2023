const express = require('express');
const app = express();
const errorMiddleWare = require('./middlewares/errors')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
// Import routes here
const products = require('./routes/product')
const auth = require('./routes/auth')
const order = require('./routes/order')

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)



app.use(errorMiddleWare);

module.exports = app