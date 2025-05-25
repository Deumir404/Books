import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styles from './BookPage.module.css';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chaptersLoading, setChaptersLoading] = useState(false);

  const getStarColor = (rating) => {
    if (!rating) return '#cccccc';
    if (rating < 2.5) return '#ff4444';
    if (rating < 4) return '#ffbb33';
    return '#00c851';
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
    const fetchChapters = async () => {
      if (!book || !book.chapters || book.chapters.length === 0) return;

      try {
        setChaptersLoading(true);
        const chaptersPromises = book.chapters.map(chapter => 
          axios.get(`/books/chapters/${chapter.id}`)
        );
        
        const chaptersResponses = await Promise.all(chaptersPromises);
        const chaptersData = chaptersResponses.map(response => response.data);
        
        setChapters(chaptersData);
      } catch (err) {
        console.error('Ошибка при загрузке глав:', err);
        setError(prev => prev || 'Не удалось загрузить некоторые главы');
      } finally {
        setChaptersLoading(false);
      }
    };

    fetchChapters();
  }, [book]);

  const renderChapters = () => {
    if (chaptersLoading) return <div className={styles.loading}>Загрузка глав...</div>;
    if (!book?.chapters || book.chapters.length === 0) return <p>Главы не найдены</p>;
    if (chapters.length === 0) return <p>Не удалось загрузить содержимое глав</p>;

    return (
      <div className={styles.chaptersList}>
        {chapters.map(chapter => (
          <div key={chapter.id} className={styles.chapter}>
            <h3>{chapter.num}. {chapter.title}</h3>
            <p className={styles.chapterDate}>
              Опубликовано: {new Date(chapter.publishedDate).toLocaleDateString()}
            </p>
            <div className={styles.chapterText}>{chapter.text}</div>
          </div>
        ))}
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