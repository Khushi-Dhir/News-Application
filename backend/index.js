const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const colors = require('colors')
const connectdb = require('./config/db.js')
const cors = require('cors')
const { errorHandler } = require('./middleware/errorMiddleware.js')
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');


connectdb()
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/user', require('./routes/authRoutes.js'));
app.use('/api/get-me', require('./routes/userRoutes.js'));
app.use('/api/news',require('./routes/newsRoutes.js')) 


app.use(errorHandler)
app.listen(PORT, () => console.log(`listening on port ${PORT}`))