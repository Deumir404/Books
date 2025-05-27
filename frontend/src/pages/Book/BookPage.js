import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAuthToken, getUserData } from '../../utils/auth';
import styles from './BookPage.module.css';

const BookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [userBookStatuses, setUserBookStatuses] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [chapterStatuses, setChapterStatuses] = useState({});
  const [userBookEntries, setUserBookEntries] = useState([]);

  const getStarColor = (rating) => {
    if (!rating) return '#cccccc';
    if (rating < 2.5) return '#ff4444';
    if (rating < 4) return '#ffbb33';
    return '#00c851';
  };

  const fetchUserBookEntries = useCallback(async () => {
    try {
      const token = getAuthToken();
      const user = getUserData();
      if (!token || !user?.id) return;

      const response = await axios.get(`/Users/${user.id}/UserBook?bookId=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserBookEntries(response.data);

      // Обрабатываем все записи
      const bookStatuses = [];
      const chapterStatusMap = {};

      response.data.forEach(entry => {
        if (entry.book?.id === parseInt(id)) {
          // Для статусов книги (idChapter = 1 или отсутствует)
          if (!entry.chapter || entry.chapter.id === 1) {
            bookStatuses.push(entry.category);
          }
          // Для статусов глав
          else if (entry.chapter) {
            chapterStatusMap[entry.chapter.id] = entry.category;
          }
        }
      });

      setUserBookStatuses(bookStatuses);
      setChapterStatuses(chapterStatusMap);
    } catch (err) {
      console.error('Ошибка при получении статуса книги:', err);
    }
  }, [id]);

  const updateBookStatus = async (category, chapterId = null) => {
    try {
      setIsUpdatingStatus(true);
      const token = getAuthToken();
      const user = getUserData();
      
      if (!token || !user?.id) {
        throw new Error('Необходимо авторизоваться');
      }

      if (chapterId) {
        // Механика для глав (из второго кода) - обновление существующей записи
        const existingEntry = userBookEntries.find(entry => 
          entry.chapter?.id === chapterId && entry.book?.id === parseInt(id)
        );

        if (existingEntry) {
          await axios.put(
            `/Users/${user.id}/UserBook/${existingEntry.idUserBook}`,
            { idBook: parseInt(id), idChapter: chapterId, category },
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }}
          );

        } else {
          await axios.post(
            `/Users/${user.id}/UserBook`,
            { idBook: parseInt(id), idChapter: chapterId, category },
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }}
          );
        }
      } else {
        // Механика для книги (из первого кода) - удаление всех записей и создание новой
        const entriesToDelete = userBookEntries.filter(entry => 
          entry.book?.id === parseInt(id) && (!entry.chapter || entry.chapter.id === 1)
        );

        await Promise.all(entriesToDelete.map(entry => 
          axios.delete(
            `/Users/${user.id}/UserBook/${entry.idUserBook}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          )
        ));

        if (category !== 0) {
          await axios.post(
            `/Users/${user.id}/UserBook`,
            { idBook: parseInt(id), idChapter: 1, category },
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }}
          );
        }
      }

      // Обновляем данные
      navigate(0);
    } catch (err) {
      console.error('Ошибка при обновлении статуса книги:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookData();
  }, [id]);

  useEffect(() => {
    if (book) {
      fetchUserBookEntries();
      const fetchChapters = async () => {
        if (!book.chapters?.length) return;
        try {
          setChaptersLoading(true);
          const chaptersResponses = await Promise.all(
            book.chapters.map(chapter => axios.get(`/books/chapters/${chapter.id}`))
          );
          setChapters(chaptersResponses.map(r => r.data));
        } catch (err) {
          console.error('Ошибка при загрузке глав:', err);
          setError('Не удалось загрузить некоторые главы');
        } finally {
          setChaptersLoading(false);
        }
      };
      fetchChapters();
    }
  }, [book, fetchUserBookEntries]);

  const renderChapters = () => {
    if (chaptersLoading) return <div className={styles.loading}>Загрузка глав...</div>;
    if (!book?.chapters?.length) return <p>Главы не найдены</p>;
    if (!chapters.length) return <p>Не удалось загрузить содержимое глав</p>;

    return (
      <div className={styles.chaptersList}>
        {chapters.map(chapter => {
          const chapterStatus = chapterStatuses[chapter.id];
          const isChapterReading = chapterStatus === 1;
          const isChapterRead = chapterStatus === 2;
          
          return (
            <div key={chapter.id} className={styles.chapter}>
              <h3>{chapter.num}. {chapter.title}</h3>
              <p className={styles.chapterDate}>
                Опубликовано: {new Date(chapter.publishedDate).toLocaleDateString()}
              </p>
              <div className={styles.chapterText}>{chapter.text}</div>
              <div className={styles.chapterButtons}>
                <button 
                  className={`${styles.markChapterButton} ${
                    isChapterReading ? styles.readingChapter : ''
                  } ${isChapterRead ? styles.readChapter : ''}`}
                  onClick={() => {
                    const newStatus = isChapterRead ? 0 : isChapterReading ? 2 : 1;
                    updateBookStatus(newStatus, chapter.id);
                  }}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? 'Сохранение...' : 
                   isChapterRead ? '✓ Глава прочитана' : 
                   isChapterReading ? 'Читаю главу ✓' : 'Читаю главу'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBookActions = () => {
    if (!getAuthToken()) return null;

    const isBookRead = userBookStatuses.includes(4);
    const isInPlans = userBookStatuses.includes(3);

    return (
      <div className={styles.bookActions}>
        <button 
          className={`${styles.statusButton} ${isBookRead ? styles.statusButtonActive : ''}`}
          onClick={() => updateBookStatus(isBookRead ? 0 : 4)}
          disabled={isUpdatingStatus}
        >
          {isUpdatingStatus ? '...' : isBookRead ? '✓ Прочитано' : 'Прочитано'}
        </button>
        
        {!isBookRead && (
          <button 
            className={`${styles.statusButton} ${isInPlans ? styles.statusButtonActive : ''}`}
            onClick={() => updateBookStatus(isInPlans ? 0 : 3)}
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? '...' : isInPlans ? '✓ В планах' : 'В планах'}
          </button>
        )}
      </div>
    );
  };

  if (loading) return <div className={styles.loading}>Загрузка книги...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;
  if (!book) return <div className={styles.error}>Книга не найдена</div>;

  const starColor = getStarColor(book.rating);

  return (
    <div className={styles.bookPage}>
      <div className={styles.headerRow}>
        <Link to="/catalog" className={styles.backLink}>← Вернуться в каталог</Link>
        {renderBookActions()}
      </div>

      <div className={styles.bookContent}>
        <div className={styles.leftColumn}>
          <img 
            src={book.coverURL || '/images/cover/empty.jpg'} 
            alt={book.title} 
            className={styles.bookCover}
          />
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.titleRating}>
            <h1>{book.title}</h1>
            <span className={styles.rating} style={{ color: starColor }}>
              ★ {book.rating?.toFixed(1) || 'Н/Д'}
            </span>
          </div>

          <div className={styles.bookMeta}>
            <p><strong>Автор:</strong> {book.author?.nickname || 'Неизвестен'}</p>
            <p><strong>Дата публикации:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
            
            {book.categories?.length > 0 && (
              <p><strong>Категории:</strong> {book.categories.map(c => c.name).join(', ')}</p>
            )}

            {book.tags?.length > 0 && (
              <div className={styles.tags}>
                <strong>Теги:</strong>
                <div className={styles.tagList}>
                  {book.tags.map(tag => (
                    <span key={tag.id} className={styles.tag}>{tag.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.description}>
            <h3>Описание</h3>
            <p>{book.description}</p>
          </div>
        </div>
      </div>

      <div className={styles.chaptersSection}>
        <h2>Главы</h2>
        {renderChapters()}
      </div>
    </div>
  );
};

export default BookPage;