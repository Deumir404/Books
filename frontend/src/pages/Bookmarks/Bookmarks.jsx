import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAuthToken, getUserData } from '../../utils/auth';
import styles from './BookmarksPage.module.css';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [booksData, setBooksData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    read: true,
    reading: true,
    planned: true
  });
  const [expandedBooks, setExpandedBooks] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleBook = (bookId) => {
    setExpandedBooks(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  // Группировка закладок по категориям
  const groupBookmarks = (bookmarks) => {
    const grouped = {
      read: [],       // Полностью прочитанные книги (category = 4)
      reading: [],    // Книги с читаемыми главами (category = 1 или 2)
      planned: [],    // Книги в планах (category = 3)
    };

    bookmarks.forEach(bookmark => {
      if (bookmark.category === 4) {
        // Полностью прочитанные книги
        if (!grouped.read.some(b => b.book.id === bookmark.book.id)) {
          grouped.read.push({
            ...bookmark,
            isFullyRead: true
          });
        }
      } else if (bookmark.category === 3) {
        // Книги в планах
        if (!grouped.planned.some(b => b.book.id === bookmark.book.id)) {
          grouped.planned.push(bookmark);
        }
      } else {
        // Читаемые главы
        const existingBook = grouped.reading.find(b => b.book.id === bookmark.book.id);
        if (existingBook) {
          if (bookmark.chapter) {
            existingBook.chapters.push({
              id: bookmark.chapter.id,
              title: bookmark.chapter.title,
              num: bookmark.chapter.num,
              status: bookmark.category
            });
          }
        } else {
          grouped.reading.push({
            book: bookmark.book,
            chapters: bookmark.chapter ? [{
              id: bookmark.chapter.id,
              title: bookmark.chapter.title,
              num: bookmark.chapter.num,
              status: bookmark.category
            }] : [],
            isFullyRead: false
          });
        }
      }
    });

    // Убедимся, что книги, которые есть в "read", не попадают в "reading"
    grouped.reading = grouped.reading.filter(bookItem => 
      !grouped.read.some(readItem => readItem.book.id === bookItem.book.id)
    );

    return grouped;
  };

  // Загрузка дополнительных данных о книге
  const fetchBookData = async (bookId) => {
    try {
      const response = await axios.get(`/Books/${bookId}`);
      return {
        title: response.data.title,
        coverURL: response.data.coverURL || '/images/cover/empty.jpg',
        author: response.data.author?.nickname || 'Неизвестен'
      };
    } catch (err) {
      console.error(`Ошибка при загрузке книги ${bookId}:`, err);
      return {
        title: 'Неизвестная книга',
        coverURL: '/images/cover/empty.jpg',
        author: 'Неизвестен'
      };
    }
  };

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const user = getUserData();
      
      if (!token || !user?.id) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      
      const response = await axios.get(`/Users/${user.id}/UserBook`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Создаем массив уникальных ID книг
      const bookIds = [...new Set(response.data.map(item => item.book.id))];
      
      // Загружаем данные для всех книг
      const booksInfo = {};
      await Promise.all(
        bookIds.map(async (bookId) => {
          booksInfo[bookId] = await fetchBookData(bookId);
        })
      );

      setBooksData(booksInfo);
      setBookmarks(response.data);

      // Инициализируем состояние для сворачивания книг
      const initialExpandedBooks = {};
      response.data.forEach(item => {
        if (item.book && item.book.id) {
          initialExpandedBooks[item.book.id] = true;
        }
      });
      setExpandedBooks(initialExpandedBooks);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const groupedBookmarks = groupBookmarks(bookmarks);

  const getStatusText = (status) => {
    switch(status) {
      case 1: return 'Читаю';
      case 2: return 'Прочитано';
      default: return '';
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка закладок...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  if (!isAuthenticated) {
    return (
      <div className={styles.notAuthenticated}>
        <div className={styles.authMessage}>
          <p>Чтобы просматривать свои закладки, вам необходимо авторизоваться.</p>
          <div className={styles.authLinks}>
            <Link to="/login" className={styles.authButton}>Войти</Link>
            <Link to="/register" className={styles.authButton}>Зарегистрироваться</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookmarksPage}>
      
      {/* Полностью прочитанные книги */}
      <section className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('read')}>
          <h2>Прочитанные книги</h2>
          <span className={styles.toggleIcon}>
            {expandedSections.read ? '▼' : '▶'}
          </span>
        </div>
        {expandedSections.read && (
          groupedBookmarks.read.length > 0 ? (
            <div className={styles.booksGrid}>
              {groupedBookmarks.read.map(bookmark => (
                <div key={bookmark.idUserBook} className={styles.bookCard}>
                  <Link to={`/book/${bookmark.book.id}`} className={styles.bookLink}>
                    <img 
                      src={booksData[bookmark.book.id]?.coverURL || '/images/cover/empty.jpg'} 
                      alt={booksData[bookmark.book.id]?.title || 'Книга'} 
                      className={styles.bookCover}
                    />
                    <div className={styles.bookInfo}>
                      <h3 className={styles.bookTitle}>{booksData[bookmark.book.id]?.title || 'Неизвестная книга'}</h3>
                      <p className={styles.bookAuthor}>
                        {booksData[bookmark.book.id]?.author || 'Неизвестен'}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyMessage}>Нет прочитанных книг</p>
          )
        )}
      </section>

      {/* Книги с читаемыми главами */}
      <section className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('reading')}>
          <h2>Читаю сейчас</h2>
          <span className={styles.toggleIcon}>
            {expandedSections.reading ? '▼' : '▶'}
          </span>
        </div>
        {expandedSections.reading && (
          groupedBookmarks.reading.length > 0 ? (
            <div className={styles.readingBooksList}>
              {groupedBookmarks.reading.map(item => (
                <div key={item.book.id} className={styles.readingBook}>
                  <div className={styles.bookHeader} onClick={() => toggleBook(item.book.id)}>
                    <div className={styles.bookTitleWrapper}>
                      <span className={styles.toggleIcon}>
                        {expandedBooks[item.book.id] ? '▼' : '▶'}
                      </span>
                      <Link to={`/book/${item.book.id}`} className={styles.bookLink}>
                        <h3>{booksData[item.book.id]?.title || 'Неизвестная книга'}</h3>
                      </Link>
                    </div>
                    <span className={styles.bookAuthor}>
                      {booksData[item.book.id]?.author || 'Неизвестен'}
                    </span>
                  </div>
                  
                  {expandedBooks[item.book.id] && item.chapters.length > 0 && (
                    <div className={styles.chaptersList}>
                      {item.chapters.map(chapter => (
                        <div key={chapter.id} className={styles.chapterItem}>
                          <span className={styles.chapterTitle}>{chapter.num}. {chapter.title}</span>
                          <span className={`${styles.chapterStatus} ${
                            chapter.status === 2 ? styles.chapterStatusRead : ''
                          }`}>
                            {getStatusText(chapter.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyMessage}>Нет активного чтения</p>
          )
        )}
      </section>

      {/* Книги в планах */}
      <section className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('planned')}>
          <h2>Отложенные книги</h2>
          <span className={styles.toggleIcon}>
            {expandedSections.planned ? '▼' : '▶'}
          </span>
        </div>
        {expandedSections.planned && (
          groupedBookmarks.planned.length > 0 ? (
            <div className={styles.booksGrid}>
              {groupedBookmarks.planned.map(bookmark => (
                <div key={bookmark.idUserBook} className={styles.bookCard}>
                  <Link to={`/book/${bookmark.book.id}`} className={styles.bookLink}>
                    <img 
                      src={booksData[bookmark.book.id]?.coverURL || '/images/cover/empty.jpg'} 
                      alt={booksData[bookmark.book.id]?.title || 'Книга'} 
                      className={styles.bookCover}
                    />
                    <div className={styles.bookInfo}>
                      <h3 className={styles.bookTitle}>{booksData[bookmark.book.id]?.title || 'Неизвестная книга'}</h3>
                      <p className={styles.bookAuthor}>
                        {booksData[bookmark.book.id]?.author || 'Неизвестен'}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyMessage}>Нет отложенных книг</p>
          )
        )}
      </section>
    </div>
  );
};

export default BookmarksPage;