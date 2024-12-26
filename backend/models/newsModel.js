const mongoose = require('mongoose');
const newsSchema = mongoose.Schema({
  title: String,
  content: String,
  link: { type: String, unique: true },
  pubDate: Date,
  url:{type:String,unique:true},
  category: {type:String,default:'all'}
});

const News = mongoose.model('news', newsSchema);
module.exports = News;