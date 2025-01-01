import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Main() {
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/news'); // Replace with your API endpoint
      setNews(response.data.newsData);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="container-fluid newspaper-background">
      

      <section className="py-3 category-section">
        <div className="container text-center ">
          {[
            "World",
            "Politics",
            "Business",
            "Technology",
            "Arts",
            "Science",
            "Sports",
            "Health",
          ].map((category) => (
            <button
              key={category}
              className="btn btn-outline-secondary btn-sm m-2 rounded-pill"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <main className="container my-5">
        <div className="row">
          {news.length > 0 ? (
            <>
            {news.filter((newsItem) => newsItem.url).map((newsItem) => (
                <div className="col-lg-6 col-md-12 mb-4" key={newsItem.link}>
                  <div className="card shadow-sm border-0 h-100">
                      <img
                        src={newsItem.url}
                        alt={newsItem.title}
                        className="card-img-top rounded-top"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                    <div className="card-body">
                      <h5 className="card-title fw-bold newspaper-text">
                        {newsItem.title}
                      </h5>
                      <p className="card-text text-justify">
                        {newsItem.content}
                      </p>
                      <a
                        href={newsItem.link}
                        className="btn btn-dark btn-sm"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Read More
                      </a>
                      <p className="text-muted mt-3">
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
              {news.filter((newsItem) => !newsItem.url).map((newsItem) => (
                                  <div className="col-lg-6 col-md-12 mb-4" key={newsItem.link}>
                                    <div className="card shadow-sm border-0 h-100">
                                      <div className="card-body">
                                        <h5 className="card-title fw-bold newspaper-text">{newsItem.title}</h5>
                                        <p className="card-text">{newsItem.content}</p>
                                        <a
                                          href={newsItem.link}
                                          className="btn btn-outline-dark btn-sm"
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          Read More
                                        </a>
                                        <p className="text-muted mt-2">
                                          {new Date(newsItem.pubDate).toLocaleString()}
                                          <br />
                                          <span className="fw-bold">Category:</span> {newsItem.category}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </>
                          ) : (
                            <p className="text-center text-muted">No news articles available.</p>
                          )}
        </div>
      </main>

      <footer className="bg-light text-dark py-3 border-top">
        <div className="container text-center">
          <p className="mb-0">
            &copy; 2024 <strong>The Daily Chronicle</strong>. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Main;