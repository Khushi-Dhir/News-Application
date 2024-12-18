const express = require('express')
const router = express.Router()
const { getNews,setNews ,putNews,deleteNews } = require('../controllers/newsController.js')
router.route('/').get(getNews).post(setNews)

router.route('/:id').put(putNews).delete(deleteNews)

module.exports = router 