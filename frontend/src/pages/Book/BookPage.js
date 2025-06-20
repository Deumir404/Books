import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { getAuthToken, getUserData } from '../../utils/auth';
import styles from './BookPage.module.css';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [displayedChapters, setDisplayedChapters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [userBookStatus, setUserBookStatus] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [chapterStatuses, setChapterStatuses] = useState({});
  const [userBookEntries, setUserBookEntries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintCommentId, setComplaintCommentId] = useState(null);
  const [complaintReason, setComplaintReason] = useState('');
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [complaintError, setComplaintError] = useState(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const MAX_REVIEW_LENGTH = 200;

  const getStarColor = (rating) => {
    if (!rating) return '#cccccc';
    if (rating < 2.5) return '#ff4444';
    if (rating < 4) return '#ffbb33';
    return '#00c851';
  };

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownload = (format) => {
    setShowDownloadOptions(false);
    const downloadUrl = `https://localhost:7152/Books/download?path=books/${id}/${id}.${format}`;
    window.open(downloadUrl, '_blank');
  };

  const fetchUserRating = useCallback(async () => {
    try {
      const token = getAuthToken();
      const user = getUserData();
      
      if (!token || !user?.id) return;

      const response = await axios.get(`/Review/user/${user.id}/book/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data) {
        setRating(response.data.review || 0);
      }
    } catch (err) {
      console.error('Ошибка при получении оценки пользователя:', err);
    }
  }, [id]);

  const fetchUserBookEntries = useCallback(async () => {
    try {
      const token = getAuthToken();
      const user = getUserData();
      if (!token || !user?.id) return;

      const response = await axios.get(`/Users/${user.id}/UserBook?bookId=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserBookEntries(response.data);

      const bookStatusEntry = response.data.find(entry => 
        entry.book?.id === parseInt(id) && !entry.chapter
      );
      if (bookStatusEntry) {
        setUserBookStatus(bookStatusEntry.category);
      } else {
        setUserBookStatus(null);
      }

      const statuses = {};
      response.data.forEach(entry => {
        if (entry.chapter) {
          statuses[entry.chapter.id] = entry.category;
        }
      });
      setChapterStatuses(statuses);
    } catch (err) {
      console.error('Ошибка при получении статуса книги:', err);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`/Comment/book/${id}`);
      const user = getUserData();
      
      const reviewsWithRatings = response.data.map(review => {
        const rating = review.review || 0;
        
        if (user?.id && review.user?.id === user.id) {
          setHasUserReviewed(true);
          setRating(rating);
        }
        
        return {
          ...review,
          review: rating
        };
      });
      
      setReviews(reviewsWithRatings);
    } catch (err) {
      console.error('Ошибка при загрузке отзывов:', err);
    }
  }, [id]);

  const submitRating = async (selectedRating) => {
    try {
      const token = getAuthToken();
      const user = getUserData();
      
      if (!token || !user?.id) {
        throw new Error('Необходимо авторизоваться');
      }

      await axios.post(`/Review/book/${id}`, 
        { review: selectedRating },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRating(selectedRating);
      return true;
    } catch (err) {
      console.error('Ошибка при отправке оценки:', err);
      setReviewError(err.response?.data?.message || err.message || 'Ошибка при отправке оценки');
      return false;
    }
  };

  const updateBookStatus = async (category, chapterId = null) => {
    try {
      setIsUpdatingStatus(true);
      const token = getAuthToken();
      const user = getUserData();
      
      if (!token || !user?.id) {
        throw new Error('Необходимо авторизоваться');
      }

      if (chapterId) {
        const existingEntry = userBookEntries.find(entry => 
          entry.chapter?.id === chapterId && entry.book?.id === parseInt(id)
        );

        if (existingEntry) {
          await axios.put(
            `/Users/${user.id}/UserBook/${existingEntry.idUserBook}`,
            { idBook: parseInt(id), idChapter: chapterId, category },
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
          );
        } else {
          await axios.post(
            `/Users/${user.id}/UserBook`,
            { idBook: parseInt(id), idChapter: chapterId, category },
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        const existingEntry = userBookEntries.find(entry => 
          entry.book?.id === parseInt(id) && !entry.chapter
        );

        if (existingEntry) {
          if (category === 0) {
            await axios.delete(
              `/Users/${user.id}/UserBook/${existingEntry.idUserBook}`,
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
          } else {
            await axios.put(
              `/Users/${user.id}/UserBook/${existingEntry.idUserBook}`,
              { idBook: parseInt(id), idChapter: null, category },
              { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
          }
        } else if (category !== 0) {
          await axios.post(
            `/Users/${user.id}/UserBook`,
            { idBook: parseInt(id), idChapter: null, category },
            { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
          );
        }
      }

      await fetchUserBookEntries();
    } catch (err) {
      console.error('Ошибка при обновлении статуса книги:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim() || newReview.length > MAX_REVIEW_LENGTH || rating === 0 || hasUserReviewed) return;
    
    try {
      setIsReviewing(true);
      setReviewError(null);
      const token = getAuthToken();
      const user = getUserData();
      
      if (!token || !user?.id) {
        throw new Error('Необходимо авторизоваться для оставления отзыва');
      }

      await axios.post('/Comment', {
        text: newReview,
        bookId: parseInt(id),
        userId: user.id,
        review: rating,
        ratingData: `*str: ${rating}`
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNewReview('');
      setCharCount(0);
      setHasUserReviewed(true);
      await fetchReviews();
    } catch (err) {
      console.error('Ошибка при отправке отзыва:', err);
      setReviewError(err.response?.data?.message || err.message || 'Ошибка при отправке отзыва');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleReviewChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_REVIEW_LENGTH) {
      setNewReview(text);
      setCharCount(text.length);
    }
  };

  const handleComplaintSubmit = async () => {
    if (!complaintReason.trim()) return;
    
    try {
      setIsSubmittingComplaint(true);
      setComplaintError(null);
      const token = getAuthToken();
      const user = getUserData();
      
      if (!token || !user?.id) {
        throw new Error('Необходимо авторизоваться для подачи жалобы');
      }

      await axios.post('/Complaint', {
        start: complaintReason,
        idComment: complaintCommentId,
        idUser: user.id,
        struct: 0
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setShowComplaintModal(false);
      setComplaintReason('');
      setComplaintCommentId(null);
    } catch (err) {
      console.error('Ошибка при отправке жалобы:', err);
      setComplaintError(err.response?.data?.message || err.message || 'Ошибка при отправке жалобы');
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const openComplaintModal = (commentId) => {
    setComplaintCommentId(commentId);
    setShowComplaintModal(true);
  };

  const updateDisplayedChapters = (page) => {
    const startIndex = (page - 1) * 3;
    const endIndex = startIndex + 3;
    setDisplayedChapters(allChapters.slice(startIndex, endIndex));
    setCurrentPage(page);
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
      fetchReviews();
      fetchUserRating();
      
      const fetchChapters = async () => {
        if (!book.chapters?.length) return;
        try {
          setChaptersLoading(true);
          const chaptersResponses = await Promise.all(
            book.chapters.map(chapter => axios.get(`/books/chapters/${chapter.id}`))
          );
          const chaptersData = chaptersResponses.map(r => r.data);
          setAllChapters(chaptersData);
          setDisplayedChapters(chaptersData.slice(0, 3));
        } catch (err) {
          console.error('Ошибка при загрузке глав:', err);
          setError('Не удалось загрузить некоторые главы');
        } finally {
          setChaptersLoading(false);
        }
      };
      fetchChapters();
    }
  }, [book, fetchUserBookEntries, fetchReviews, fetchUserRating]);

  const renderChapters = () => {
    if (chaptersLoading) return <div className={styles.loading}>Загрузка глав...</div>;
    if (!book?.chapters?.length) return <p>Главы не найдены</p>;
    if (!displayedChapters.length) return <p>Не удалось загрузить содержимое глав</p>;

    return (
      <div className={styles.chaptersContainer}>
        <div className={styles.chaptersList}>
          {displayedChapters.map(chapter => {
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
                    onClick={() => updateBookStatus(
                      isChapterRead ? 0 : isChapterReading ? 2 : 1, 
                      chapter.id
                    )}
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
        
        {allChapters.length > 3 && (
          <div className={styles.pagination}>
            {Array.from({ length: Math.ceil(allChapters.length / 3) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                onClick={() => updateDisplayedChapters(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBookActions = () => {
    if (!getAuthToken()) return null;

    const isBookRead = userBookStatus === 4;
    const isInPlans = userBookStatus === 3;

    return (
      <div className={styles.bookActions}>
        <button 
          className={`${styles.statusButton} ${isBookRead ? styles.readChapter : ''}`}
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

  const renderRatingStars = () => {
    return (
      <div className={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${(hoverRating || rating) >= star ? styles.filled : ''}`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={async () => {
              const success = await submitRating(star);
              if (success) {
                setRating(star);
              }
            }}
          >
            ★
          </span>
        ))}
        <span className={styles.ratingText}>
          {rating ? `Ваша оценка: ${rating}` : "Поставьте оценку"}
        </span>
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div id="reviews-section" className={styles.reviewsSection}>
        <h2>Отзывы ({reviews.length})</h2>
        
        {getAuthToken() && !hasUserReviewed && (
          <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
            {renderRatingStars()}
            <textarea
              value={newReview}
              onChange={handleReviewChange}
              placeholder="Напишите ваш отзыв (макс. 200 символов)..."
              className={styles.reviewInput}
              rows={3}
              disabled={isReviewing || hasUserReviewed}
            />
            <div className={styles.charCounter}>
              {charCount}/{MAX_REVIEW_LENGTH}
            </div>
            <button 
              type="submit" 
              className={styles.reviewSubmitButton}
              disabled={isReviewing || !newReview.trim() || newReview.length > MAX_REVIEW_LENGTH || rating === 0 || hasUserReviewed}
            >
              {isReviewing ? 'Отправка...' : 'Отправить отзыв'}
            </button>
            {reviewError && <div className={styles.reviewError}>{reviewError}</div>}
          </form>
        )}

        {getAuthToken() && hasUserReviewed && (
          <div className={styles.reviewNotice}>
            Вы уже оставили отзыв на эту книгу
          </div>
        )}

        <div className={styles.reviewsList}>
          {reviews.length === 0 ? (
            <p className={styles.noReviews}>Пока нет отзывов. Будьте первым!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewAuthor}>
                    {review.user?.username || 'Аноним'}
                    <span className={styles.userRatingStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star}
                          className={`${styles.star} ${star <= (review.review || 0) ? styles.filled : ''}`}
                          style={{color: star <= (review.review || 0) ? getStarColor(review.review) : '#cccccc'}}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className={styles.reviewDate}>
                    {new Date(review.createdDate).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className={styles.reviewText}>{review.text}</div>
                {getAuthToken() && review.user?.id !== getUserData()?.id && (
                  <button 
                    className={styles.complaintButton}
                    onClick={() => openComplaintModal(review.id)}
                  >
                    Пожаловаться
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {showComplaintModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Подать жалобу на отзыв</h3>
              <textarea
                value={complaintReason}
                onChange={(e) => setComplaintReason(e.target.value)}
                placeholder="Укажите причину жалобы..."
                className={styles.complaintInput}
                rows={4}
              />
              {complaintError && <div className={styles.complaintError}>{complaintError}</div>}
              <div className={styles.modalButtons}>
                <button 
                  onClick={() => setShowComplaintModal(false)}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
                <button 
                  onClick={handleComplaintSubmit}
                  className={styles.submitButton}
                  disabled={isSubmittingComplaint || !complaintReason.trim()}
                >
                  {isSubmittingComplaint ? 'Отправка...' : 'Отправить жалобу'}
                </button>
              </div>
            </div>
          </div>
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
        <div className={styles.headerButtons}>
          <Link to="/catalog" className={styles.backLink}>← Вернуться в каталог</Link>
          <div className={styles.actionButtons}>
            <button onClick={scrollToReviews} className={styles.reviewsButton}>Отзывы</button>
            <div className={styles.downloadContainer}>
              <button 
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className={styles.downloadButton}
              >
                Скачать
              </button>
              {showDownloadOptions && (
                <div className={styles.downloadOptions}>
                  <button onClick={() => handleDownload('pdf')}>PDF</button>
                  <button onClick={() => handleDownload('fb2')}>FB2</button>
                </div>
              )}
            </div>
          </div>
        </div>
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

      {renderReviews()}
    </div>
  );
};

export default BookPage;