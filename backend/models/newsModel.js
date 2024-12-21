const mongoose = require('mongoose');
const newsSchema = mongoose.Schema({
  title: String,
  content: String,
  link: { type: String, unique: true },
  pubDate: Date
});

const News = mongoose.model('news', newsSchema);
module.exports = News;