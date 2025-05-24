import React from 'react';
import styles from './BookList.module.css';

const BookList = ({ books, sortBy, onSortChange }) => {
  return (
    <div className={styles.bookListContainer}>
      <div className={styles.sortOptions}>
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
        {books.map(book => (
          <div className={styles.bookCard} key={book.id}>
            <h3 className={styles.bookTitle}>{book.title}</h3>
            <div className={styles.bookMeta}>
              <span>Автор: {book.author?.nickname || 'Неизвестен'}</span><div/>
              <span>Дата: {new Date(book.publishedDate).toLocaleDateString()}</span>
            </div>
            {book.rating && (
              <div className={styles.bookRating}>
                Рейтинг: {book.rating.toFixed(1)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;