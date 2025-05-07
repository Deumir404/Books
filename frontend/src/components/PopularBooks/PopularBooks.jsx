import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PopularBooks.module.css';

// Импортируем обложки книг
import MasterAndMargarita from '../../assets/master-and-margarita.png';
import CrimeAndPunishment from '../../assets/crime-and-punishment.png';
import WarAndPeace from '../../assets/war-and-peace.png';
import EugeneOnegin from '../../assets/eugene-onegin.png';
import DoctorZhivago from '../../assets/doctor-zhivago.png';

const PopularBooks = () => {
  const books = [
    { 
      title: 'Мастер и Маргарита', 
      author: 'Михаил Булгаков',
      cover: MasterAndMargarita
    },
    { 
      title: 'Преступление и наказание', 
      author: 'Фёдор Достоевский',
      cover: CrimeAndPunishment
    },
    { 
      title: 'Война и мир', 
      author: 'Лев Толстой',
      cover: WarAndPeace
    },
    { 
      title: 'Евгений Онегин', 
      author: 'Александр Пушкин',
      cover: EugeneOnegin
    },
    { 
      title: 'Доктор Живаго', 
      author: 'Борис Пастернак',
      cover: DoctorZhivago
    }
  ];

  return (
    <div className={styles.booksContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Популярные книги</h2>
        <Link to="/books" className={styles.allBooksLink}>
          Смотреть все →
        </Link>
      </div>
      
      <div className={styles.booksGrid}>
        {books.map((book, index) => (
          <Link to={`/book/${index}`} className={styles.bookCard} key={index}>
            <img 
              src={book.cover} 
              alt={book.title} 
              className={styles.bookCover} 
            />
            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>{book.author}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularBooks;