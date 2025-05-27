import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BookList.module.css';

const BookList = ({ books, sortBy, onSortChange }) => {
  const location = useLocation();
  const searchQuery = location.state?.searchQuery;
  const isSearch = location.state?.isSearch;

  const getStarColor = (rating) => {
    if (!rating) return '#cccccc';
    if (rating < 2.5) return '#ff4444';
    if (rating < 4) return '#ffbb33';
    return '#00c851';
  };

  return (
    <div className={styles.bookListContainer}>
      <div className={styles.sortOptions}>
        {isSearch && searchQuery && (
          <div className={styles.searchInfo}>
            Результаты поиска по запросу: "{searchQuery}"
            <Link to="/catalog" className={styles.clearSearch}>
              (Очистить поиск)
            </Link>
          </div>
        )}
        
        <span className={styles.sortLabel}>Сортировать по:</span>
        <select 
          className={styles.sortSelect}
          value={sortBy}
          onChange={onSortChange}
        >
          <option value="title">Названию</option>
          <option value="publishedDate">Дате публикации (новые)</option>
          <option value="publishedDateOld">Дате публикации (старые)</option>
          <option value="ratingHigh">Рейтингу (высокий)</option>
          <option value="ratingLow">Рейтингу (низкий)</option>
        </select>
      </div>
      
      <div className={styles.booksGrid}>
        {books.length > 0 ? (
          books.map(book => {
            const starColor = getStarColor(book.rating);
            
            return (
              <Link 
                to={`/book/${book.id}`} 
                className={styles.bookCard} 
                key={book.id}
              >
                <img 
                  src={book.coverURL || '/images/cover/empty.jpg'} 
                  alt={book.title} 
                  className={styles.bookCover}
                />
                <div className={styles.titleWithRating}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  {book.rating && (
                    <div className={styles.ratingContainer}>
                      <span className={styles.starIcon} style={{ color: starColor }}>★</span>
                      <span className={styles.ratingValue} style={{ color: starColor }}>
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles.bookMeta}>
                  <span>Автор: {book.author?.nickname || 'Неизвестен'}</span>
                  <div/>
                  <span>Дата: {new Date(book.publishedDate).toLocaleDateString()}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className={styles.noResults}>
            {isSearch ? 
              'По вашему запросу ничего не найдено' : 
              'Книги не найдены'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;