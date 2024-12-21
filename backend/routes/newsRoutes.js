const express = require('express')
const router = express.Router()
const { getNews } = require('../controllers/newsController.js')
router.route('/').get(getNews)

module.exports = router 