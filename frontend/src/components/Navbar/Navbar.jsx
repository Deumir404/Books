import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import bookIcon from '../../assets/book-icon.svg';
import searchIcon from '../../assets/search-icon.svg'; 
import userIcon from '../../assets/user-icon.svg';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={bookIcon} alt="Books" className={styles.bookIcon} />
        <text className={styles.logoText}>Books</text>
      </div>

      <div className={styles.navLinks}>
        <Link to="/" className={styles.navLink}>Главная</Link>
        <Link to="/catalog" className={styles.navLink}>Каталог</Link>
        <Link to="/bookmarks" className={styles.navLink}>Закладки</Link>
        <Link to="/rules" className={styles.navLink}>Правила</Link>
      </div>

      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Поиск книг..." 
          className={styles.searchInput}
        />
        <img src={searchIcon} alt="Search" className={styles.searchIcon} />
      </div>

      <div className={styles.userContainer}>
        <img src={userIcon} alt="User" className={styles.userIcon} />
      </div>
    </nav>
  );
};

export default Navbar;