const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 3000;


app.use('/api/news',require('./routes/newsRoutes.js'))

app.listen(PORT, () => console.log(`listening on port ${PORT}`))