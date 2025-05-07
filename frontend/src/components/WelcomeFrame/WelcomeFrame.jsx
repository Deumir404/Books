import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomeFrame.module.css';
import booksImage from '../../assets/books-image.png';

const WelcomeFrame = () => {
  return (
    <div className={styles.welcomeFrame}>
      <div className={styles.textSection}>
        <h1>Добро пожаловать в Books</h1>
        <p>
          Найдите тысячи книг в нашей онлайн библиотеке<br />
          Откройте для себя новых авторов и жанры<br />
          Или же сами станьте автором и получайте оценки от других читателей
        </p>
        
        <div className={styles.buttonsRow}>
          <Link to="/catalog" className={styles.startReadingBtn}>Начать чтение</Link>
          <Link to="/catalog" className={styles.becomeAuthorBtn}>Стать автором</Link>
        </div>
      </div>
      
      <div className={styles.imageSection}>
        <img src={booksImage} alt="Книги на полке" />
      </div>
    </div>
  );
};

export default WelcomeFrame;