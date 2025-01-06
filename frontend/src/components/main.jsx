import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import { gsap } from 'gsap';

const Main = () => {
  const [allNews, setAllNews] = useState([]); 
  const [filteredNews, setFilteredNews] = useState([]); 

  const fetchNews = async () => {
    try {
      const cachedNews = localStorage.getItem('newsData');
      if (cachedNews) {
        const newsData = JSON.parse(cachedNews);
        setAllNews(newsData);
        setFilteredNews(newsData);
      } else {
        const response = await axios.get('http://localhost:3000/api/news');
        const newsData = response.data.newsData || [];
        setAllNews(newsData);
        setFilteredNews(newsData);
        localStorage.setItem('newsData', JSON.stringify(newsData)); 
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
    gsap.from('.news-card', {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 1,
    });
  }, []);

  const handleSearch = (query) => {
    if (query.trim() === '') {
      setFilteredNews(allNews); 
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = allNews.filter(
        (item) =>
          item.title.toLowerCase().includes(lowercasedQuery) ||
          item.content.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredNews(filtered);
    }
  };

  const handleCategorySelect = (category) => {
    const filtered = allNews.filter((item) => item.category === category.toLowerCase);
    setFilteredNews(filtered);
  };

  const newsWithUrl = filteredNews.filter((item) => item.url);
  const newsWithoutUrl = filteredNews.filter((item) => !item.url);

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Header with Search */}
      <Navbar onSearch={handleSearch} onCategorySelect={handleCategorySelect} />

      {/* Main Content */}
      <main className="container my-5">
        <div className="row">
          {/* Left Column: Main News */}
          <div className="col-lg-8">
            {/* Main News (first item with a `url`) */}
            {newsWithUrl.length > 0 && (
              <div className="card mb-5 border-0 shadow-lg news-card">
                <img
                  src={newsWithUrl[0].url}
                  className="card-img-top rounded"
                  alt={newsWithUrl[0].title}
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h3 className="card-title fw-bold">{newsWithUrl[0].title}</h3>
                  <p className="card-text">{newsWithUrl[0].content}</p>
                  <a
                    href={newsWithUrl[0].link}
                    className="btn btn-outline-primary rounded-pill px-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read More
                  </a>
                  <p className="text-muted mt-2">
                    <small>
                      Published: {new Date(newsWithUrl[0].pubDate).toLocaleString()}
                      <br />
                      <span className="fw-bold">Category:</span> {newsWithUrl[0].category}
                    </small>
                  </p>
                </div>
              </div>
            )}

            {/* Remaining News with `url` */}
            <div className="row">
              {newsWithUrl.slice(1).map((newsItem, index) => (
                <div className="col-md-6 mb-4 news-card" key={index}>
                  <div className="card border-0 shadow-sm h-100">
                    <img
                      src={newsItem.url}
                      className="card-img-top rounded"
                      alt={newsItem.title}
                      style={{ maxHeight: '350px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-semibold">{newsItem.title}</h5>
                      <p className="card-text">{newsItem.content}</p>
                      <a
                        href={newsItem.link}
                        className="btn btn-outline-primary mt-auto rounded-pill px-4"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Read More
                      </a>
                      <p className="text-muted mt-2">
                        <small>
                          Published: {new Date(newsItem.pubDate).toLocaleString()}
                          <br />
                          <span className="fw-bold">Category:</span> {newsItem.category}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Highlights */}
          <aside className="col-lg-4">
            {/* News without `url` */}
            {newsWithoutUrl.map((newsItem, index) => (
              <div className="card mb-4 border-0 shadow-sm news-card" key={index}>
                <div className="card-body">
                  <h6 className="card-title fw-semibold">{newsItem.title}</h6>
                  <p className="card-text">{newsItem.content}</p>
                  <a
                    href={newsItem.link}
                    className="btn btn-outline-dark btn-sm rounded-pill px-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read More
                  </a>
                  <p className="text-muted mt-2">
                    <small>
                      Published: {new Date(newsItem.pubDate).toLocaleString()}
                      <br />
                      <span className="fw-bold">Category:</span> {newsItem.category}
                    </small>
                  </p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; 2024 NewsHub. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Main;
