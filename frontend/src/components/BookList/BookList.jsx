import React from 'react';
import { Link } from 'react-router-dom';
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
          <option value="popularity">Популярности</option>
          <option value="price-low">Цене (сначала дешевые)</option>
          <option value="price-high">Цене (сначала дорогие)</option>
          <option value="title">Названию</option>
        </select>
      </div>
      
      <div className={styles.booksGrid}>
        {books.map(book => (
          <Link to={`/book/${book.id}`} className={styles.bookCard} key={book.id}>
            <img src={book.cover} alt={book.title} className={styles.bookCover} />
            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>{book.author}</p>
            <p className={styles.bookCategory}>{book.category}</p>
            <div className={styles.bookFooter}>
              <span className={styles.bookRating}>★ {book.rating}</span>
              <span className={styles.bookPrice}>{book.price} ₽</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookList;