import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${state.page}&pageSize=${props.pageSize}`;
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=31fd43816e394caeaeea67fd2794b928&page=${page}&pageSize=${props.pageSize}`;
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=31fd43816e394caeaeea67fd2794b928&page=${page}&pageSize=${props.pageSize}`;
    // let url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&page=${page}&pageSize=${props.pageSize}&max=20&from=2022-08-21T16:27:09Z&to=2025-02-19T16:27:09Z&apikey=97f7d157c01592d3f4a3f199aa94c394`;
    let url = `https://newsapi.org/v2/top-headlines?sources&q=in&apiKey=31fd43816e394caeaeea67fd2794b928&category=${props.category}&page=${page}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    props.setProgress(40)
    let parsedData = await data.json();
    props.setProgress(70)
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    props.setProgress(100);
    setLoading(false);
  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  }, [])

  const fetchMoreData = async () => {
    setPage(page + 1)
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${props.page}&pageSize=${props.pageSize}`;
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=31fd43816e394caeaeea67fd2794b928&page=${page}&pageSize=${props.pageSize}`;
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=31fd43816e394caeaeea67fd2794b928&page=${page}&pageSize=${props.pageSize}`;
    let url = `https://newsapi.org/v2/top-headlines?sources&q=in&apiKey=31fd43816e394caeaeea67fd2794b928&category=${props.category}&page=${page}&pageSize=${props.pageSize}`;
    // let url = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&page=${page}&pageSize=${props.pageSize}&max=20&from=2022-08-21T16:27:09Z&to=2025-02-19T16:27:09Z&apikey=97f7d157c01592d3f4a3f199aa94c394`;
    setLoading(true)
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
    setLoading(false)
  };

  return (
    <>
      <h1 className='text-center mb-3' style={{ marginTop: '90px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={loading && <Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  )
}

News.defaultProps = {
  country: 'in',
  pageSize: 5,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News;
