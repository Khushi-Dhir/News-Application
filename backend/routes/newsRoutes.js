const express = require('express')
const router = express.Router()
const { getNews,setNews ,putNews,deleteNews } = require('../controllers/newsController.js')
router.route('/').get(getNews).put(putNews)

router.route('/:id').put(putNews).delete(deleteNews)

module.exports = router 