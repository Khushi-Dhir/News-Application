const asyncHandler = require('express-async-handler')
const News = require('../models/newsModel')
const axios =require('axios')
require('dotenv').config();

const getNews =asyncHandler(async (req, res) => {
    try {
      const apiUrl = 'https://newsdata.io/api/1/news'; 
      const apiKey = process.env.api_key; 
      const params = {
        apikey: apiKey,
        language: 'en'
      };
  
      const response = await axios.get(apiUrl, { params });
      const newsData = response.data.results;
  
      // Insert or update news data in MongoDB
      for (const newsItem of newsData) {
        const { title, content, link, pubDate } = newsItem;
        await News.findOneAndUpdate(
          { link: link }, 
          { title, content, link, pubDate },
          { upsert: true } 
        );
      }
  
      res.status(200).json({ message: 'News data fetched and stored successfully' });
    } catch (error) {
      console.error('Error fetching or storing news data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = { 
    getNews 
}