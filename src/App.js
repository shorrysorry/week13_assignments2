import React, { useState, useEffect, useCallback } from "react";
import { bookSearch } from "./api";
import "./App.css";
import moment from "moment";
import picture from "./no-picture.jpg";
import { useInView } from "react-intersection-observer";

function App() {
  const [books, setBooks] = useState([]);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [load, setLoad] = useState(false);

  const [ref, inView] = useInView({ threshold: 1 });

  const onTextUpdate = (e) => {
    setText(e.target.value);
  };

  const onEnter = (e) => {
    if (e.keyCode === 13) {
      setQuery(text);
      setPage(1);
    }
  };

  const onError = (e) => {
    e.target.src = picture;
  };

  const bookSearchHandler = useCallback(
    async (query, page, reset) => {
      page === 1 ? setLoad(true) : setLoad(false);
      const params = {
        query: query,
        sort: "accuracy",
        page: page,
        size: 10
      };

      const { data } = await bookSearch(params);
      setLoad(false);
      if (reset) {
        setBooks(data.documents);
      } else {
        data.documents.length < 10
          ? setBooks(data.documents)
          : setBooks(books.concat(data.documents));
      }
    },
    [books]
  );

  useEffect(() => {
    if (query.length > 0 && !inView) {
      bookSearchHandler(query, page, true);
    }
    if (query.length > 0 && inView) {
      bookSearchHandler(query, page, false);
    }
  }, [query, page]);

  useEffect(() => {
    if (!load && inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, load]);

  if (load)
    return (
      <div className="container">
        <input
          type="search"
          placeholder="검색어를 입력 해주세요."
          name="query"
          className="input_search"
          onKeyDown={onEnter}
          onChange={onTextUpdate}
          value={text}
        />

        <p>로딩중입니다...</p>
      </div>
    );

  if (query.length > 0 && books.length == 0)
    return (
      <div className="container">
        <input
          type="search"
          placeholder="검색어를 입력 해주세요."
          name="query"
          className="input_search"
          onKeyDown={onEnter}
          onChange={onTextUpdate}
          value={text}
        />

        <p>검색 결과가 없습니다.</p>
      </div>
    );

  return (
    <div className="container">
      <input
        type="search"
        placeholder="검색어를 입력 해주세요."
        name="query"
        className="input_search"
        onKeyDown={onEnter}
        onChange={onTextUpdate}
        value={text}
      />

      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {books.length - 1 == index ? (
              <dl>
                <a href={book.url} target="_blank">
                  <dt>
                    <img
                      src={book.thumbnail}
                      alt="책 이미지"
                      onError={onError}
                    />
                  </dt>
                  <dd>
                    <h2>{book.title}</h2>
                    <p>{book.authors}</p>
                    <p>{book.publisher.toString()}</p>
                    <p>{moment(book.datetime).format("YYYY년 MM월 DD일")}</p>
                    <p ref={ref}>
                      ₩
                      {book.status === "정상판매"
                        ? book.sale_price === -1
                          ? book.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : book.sale_price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : book.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      원
                    </p>
                  </dd>
                </a>
              </dl>
            ) : (
              <dl>
                <a href={book.url} target="_blank">
                  <dt>
                    <img
                      src={book.thumbnail}
                      alt="책 이미지"
                      onError={onError}
                    />
                  </dt>
                  <dd>
                    <h2>{book.title}</h2>
                    <p>{book.authors}</p>
                    <p>{book.publisher}</p>
                    <p>{moment(book.datetime).format("YYYY년 MM월 DD일")}</p>
                    <p>
                      ₩
                      {book.status === "정상판매"
                        ? book.sale_price === -1
                          ? book.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : book.sale_price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : book.price
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      원
                    </p>
                  </dd>
                </a>
              </dl>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
