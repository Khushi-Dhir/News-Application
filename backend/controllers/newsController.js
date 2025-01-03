const asyncHandler = require('express-async-handler')
const News = require('../models/newsModel')
require('dotenv').config();
const axios = require('axios')


const getNews =asyncHandler( async ( req,res ) => {
  try {
    // const apiUrl = 'https://newsdata.io/api/1/news'; 
    //   const apiKey = process.env.api_key; 
    //   const params = {
    //     apikey: apiKey,
    //     language: 'en'
    //   };
  
    //   const response = await axios.get(apiUrl, { params });
    //   const newsData = response.data.results;
  
    //   // Insert or update news data in MongoDB
    //   for (const newsItem of newsData) {
    //     const { title, content, link, pubDate } = newsItem;
    //     await News.findOneAndUpdate(
    //       { link: link }, 
    //       { title, content, link, pubDate },
    //       { upsert: true } 
    //     );
    //   }
  
    const newsArticles = await News.find(); 
    res.status(200).json({ newsData: newsArticles });
  } catch (error) {
    console.error('Error fetching news data from database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
const setNews = asyncHandler(async (req, res) => {
  try {
    const { title, content, link, category, url } = req.body;

    if (!title || !content || !link) {
      return res.status(400).json({ message: 'Title, content, and link are required.' });
    }

    const pubDate = new Date();

    const newsArticleData = url
      ? { title, content, link, pubDate, category, url }
      : { title, content, link, pubDate, category };

    const newsArticle = new News(newsArticleData);
    await newsArticle.save();

    res.status(201).json({ message: 'News article added successfully', newsArticle });
  } catch (error) {
    console.error('Error adding news article to database:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const putNews = asyncHandler(async (req, res) => {
  try {
    const newsArticle = await News.findById(req.params.id);
    if (!newsArticle) {
      return res.status(404).json({ message: 'News Not Found' });
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } 
    );

    res.status(200).json(updatedNews);
  } catch (err) {
    console.error('Error updating news article in database:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const deleteNews = asyncHandler(async (req, res) => {
  try {
    const newsArticle = await News.findById(req.params.id);

    if (!newsArticle) {
      return res.status(404).json({ message: 'News Not Found' });
    }

    await newsArticle.deleteOne();

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting news article from database:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = { 
  getNews ,
  setNews ,
  putNews ,
  deleteNews 
}