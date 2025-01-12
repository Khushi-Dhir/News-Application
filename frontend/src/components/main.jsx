import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import { gsap } from 'gsap';

const Main = () => {
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
    if (category === 'all') {
      setFilteredNews(allNews);
    } else {
      const filtered = allNews.filter(
        (item) => item.category === category.toLowerCase()
      );
      setFilteredNews(filtered);
    }
  };

  useEffect(() => {
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

    fetchNews();
  }, []);

  useEffect(() => {
    gsap.from('.news-card', { opacity: 0, y: 30, stagger: 0.2, duration: 1 });
  }, [filteredNews]);

  const generatePages = () => {
    const newsToDisplay = filteredNews.length > 0 ? filteredNews : allNews;
    const newsWithUrl = newsToDisplay.filter((news) => news.url);
    const newsWithoutUrl = newsToDisplay.filter((news) => !news.url);
    const pages = [];

    let remainingUrlNews = [...newsWithUrl];
    let remainingNonUrlNews = [...newsWithoutUrl];

    while (remainingUrlNews.length > 0 || remainingNonUrlNews.length > 0) {
      const pageUrlNews = remainingUrlNews.splice(0, 2); // First 2 news with URL
      const pageNonUrlNews = remainingNonUrlNews.splice(0, 7 - pageUrlNews.length); // Remaining non-URL news
      pages.push({ urlNews: pageUrlNews, nonUrlNews: pageNonUrlNews });
    }

    return pages;
  };

  const pages = generatePages();
  const totalPages = pages.length;
  const currentContent = pages[currentPage - 1] || { urlNews: [], nonUrlNews: [] };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === 'next' ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  const Pagination = () => (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange('prev')}>
            Previous
          </button>
        </li>
        {pages.map((_, index) => (
          <li
            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            key={index}
          >
            <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange('next')}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="container-fluid bg-light min-vh-100">
      <Navbar onSearch={handleSearch} onCategorySelect={handleCategorySelect} />
      <main className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            {currentContent.urlNews.map((newsItem, index) => (
              <div className="card mb-4 border-0 shadow-lg news-card" key={index}>
                <img
                  src={newsItem.url}
                  className="card-img-top rounded"
                  alt={newsItem.title}
                  style={{ maxHeight: '350px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h3 className="card-title fw-bold">{newsItem.title}</h3>
                  <p className="card-text">{newsItem.content}</p>
                  <a
                    href={newsItem.link}
                    className="btn btn-outline-primary rounded-pill px-4"
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
          </div>

          <aside className="col-lg-4">
            {currentContent.nonUrlNews.map((newsItem, index) => (
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

        <Pagination />
      </main>
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; 2024 NewsHub. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Main;
