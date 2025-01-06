const express = require('express')
const {getUserData} = require('../controllers/userController')
const {userAuth} = require('../middleware/authMiddleware')
const route = express.Router()

route.get('/', userAuth, getUserData);

module.exports = route