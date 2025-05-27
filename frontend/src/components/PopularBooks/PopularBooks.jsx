import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './PopularBooks.module.css';

const PopularBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      try {
        const response = await fetch('/books');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Сортируем книги по рейтингу (по убыванию) и берем топ-5
        const topRatedBooks = data
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
        
        setBooks(topRatedBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedBooks();
  }, []);

  if (loading) {
    return <div className={styles.booksContainer}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.booksContainer}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.booksContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Популярные книги</h2>
        <Link to="/books" className={styles.allBooksLink}>
          Смотреть все →
        </Link>
      </div>
      
      <div className={styles.booksGrid}>
        {books.map((book) => (
          <Link to={`/book/${book.id}`} className={styles.bookCard} key={book.id}>
            <img 
              src={book.coverURL} 
              alt={book.title} 
              className={styles.bookCover} 
              onError={(e) => {
                e.target.src = '/images/cover/empty.jpg'; // fallback изображение
              }}
            />
            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>{book.author.nickname}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularBooks;