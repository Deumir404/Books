import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { clearAuthData, getAuthToken, getUsername, fetchUserProfile } from '../../utils/auth';
import styles from './Navbar.module.css';
import bookIcon from '../../assets/book-icon.svg';
import searchIcon from '../../assets/search-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      try {
        const response = await axios.get('/Books/search', {
          params: {
            title: searchQuery.trim(),
            // Можно добавить другие параметры поиска при необходимости
          }
        });
        
        navigate('/catalog', { 
          state: { 
            searchResults: response.data,
            searchQuery: searchQuery,
            isSearch: true 
          } 
        });
      } catch (error) {
        console.error('Ошибка поиска:', error);
      }
    }
  };

  const handleLogout = useCallback(() => {
    clearAuthData();
    setIsAuthenticatedState(false);
    setUsername('');
    setIsUserMenuOpen(false);
    navigate('/');
    window.location.reload();
  }, [navigate]);

  const fetchAndUpdateUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const userData = await fetchUserProfile();
      const newUsername = userData?.username || userData?.email || getUsername();
      
      if (newUsername) {
        setUsername(newUsername);
      }
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const checkAuth = () => {
      const tokenExists = !!getAuthToken();
      setIsAuthenticatedState(tokenExists);
      
      if (tokenExists) {
        const storedUsername = getUsername();
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          fetchAndUpdateUserData();
        }
      } else {
        setUsername('');
      }
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchAndUpdateUserData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src={bookIcon} alt="Books" className={styles.bookIcon} />
        <span className={styles.logoText}>Books</span>
      </div>

      <div className={styles.navLinks}>
        <Link to="/" className={styles.navLink} onClick={() => setIsUserMenuOpen(false)}>
          Главная
        </Link>
        <Link to="/catalog" className={styles.navLink} onClick={() => setIsUserMenuOpen(false)}>
          Каталог
        </Link>
        <Link to="/bookmarks" className={styles.navLink} onClick={() => setIsUserMenuOpen(false)}>
          Закладки
        </Link>
        <Link to="/rules" className={styles.navLink} onClick={() => setIsUserMenuOpen(false)}>
          Правила
        </Link>
      </div>

      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Поиск книг..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
        <img 
          src={searchIcon} 
          alt="Search" 
          className={styles.searchIcon} 
          onClick={() => searchQuery.trim() && handleSearch({key: 'Enter'})}
        />
      </div>

      <div className={styles.userSection} ref={userMenuRef}>
        <div 
          className={`${styles.userContainer} ${isUserMenuOpen ? styles.active : ''}`}
          onClick={toggleUserMenu}
        >
          <img src={userIcon} alt="User" className={styles.userIcon} />
        </div>

        {isUserMenuOpen && (
          <div className={styles.userMenu}>
            {isAuthenticatedState ? (
              <>
                <div className={styles.menuHeader}>
                  <span className={styles.username}>
                    {isLoading ? 'Загрузка...' : username || 'Пользователь'}
                  </span>
                </div>
                <Link to="/profile" className={styles.menuItem} onClick={() => setIsUserMenuOpen(false)}>
                  Профиль
                </Link>
                <Link to="/become-author" className={styles.menuItem} onClick={() => setIsUserMenuOpen(false)}>
                  Стать автором
                </Link>
                <div className={styles.menuDivider}></div>
                <div className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
                  Выйти
                </div>
              </>
            ) : (
              <>
                <div className={styles.menuHeader}>
                  <span>Войдите в аккаунт</span>
                </div>
                <Link to="/register" className={`${styles.menuItem} ${styles.primary}`} onClick={() => setIsUserMenuOpen(false)}>
                  Зарегистрироваться
                </Link>
                <Link to="/login" className={styles.menuItem} onClick={() => setIsUserMenuOpen(false)}>
                  Войти
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;