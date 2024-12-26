const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectdb = require('./config/db.js')
const cors = require('cors')
const { errorHandler } = require('./middleware/errorMiddleware.js')
const PORT = process.env.PORT || 3000;

connectdb()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/news',require('./routes/newsRoutes.js')) 


app.use(errorHandler)
app.listen(PORT, () => console.log(`listening on port ${PORT}`))