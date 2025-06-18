import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../../utils/auth';
import styles from './AdminAuthors.module.css';

const AuthorForm = ({ 
  author = null, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    nickname: '',
    idUser: 0
  });

  useEffect(() => {
    if (author) {
      setFormData({
        firstname: author.firstname || '',
        surname: author.surname || '',
        nickname: author.nickname || '',
        idUser: author.idUser || 0
      });
    }
  }, [author]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'idUser' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.adminAuthorsForm}>
      <h3 className={styles.adminAuthorsFormTitle}>
        {author ? 'Редактировать автора' : 'Добавить нового автора'}
      </h3>
      
      <div className={styles.adminAuthorsFormGroup}>
        <label className={styles.adminAuthorsLabel}>Имя</label>
        <input
          type="text"
          name="firstname"
          className={styles.adminAuthorsInput}
          value={formData.firstname}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.adminAuthorsFormGroup}>
        <label className={styles.adminAuthorsLabel}>Фамилия</label>
        <input
          type="text"
          name="surname"
          className={styles.adminAuthorsInput}
          value={formData.surname}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.adminAuthorsFormGroup}>
        <label className={styles.adminAuthorsLabel}>Псевдоним</label>
        <input
          type="text"
          name="nickname"
          className={styles.adminAuthorsInput}
          value={formData.nickname}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.adminAuthorsFormGroup}>
        <label className={styles.adminAuthorsLabel}>ID пользователя</label>
        <input
          type="number"
          name="idUser"
          className={styles.adminAuthorsInput}
          value={formData.idUser}
          onChange={handleInputChange}
          min="0"
        />
      </div>

      <div className={styles.adminAuthorsFormActions}>
        {onCancel && (
          <button 
            type="button"
            className={styles.adminAuthorsSecondaryBtn}
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
        <button 
          type="submit"
          className={styles.adminAuthorsPrimaryBtn}
        >
          {author ? 'Сохранить' : 'Добавить автора'}
        </button>
      </div>
    </form>
  );
};

const AdminAuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Authors', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки авторов');
      }
      
      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuthorDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/Authors/${id}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных автора');
      }
      
      const data = await response.json();
      setSelectedAuthor(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAuthor = async (formData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания автора');
      }
      
      await fetchAuthors();
      setShowAuthorForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAuthor = async (formData) => {
    try {
      if (!selectedAuthor) return;
      setIsLoading(true);
      
      const response = await fetch(`/api/Authors/${selectedAuthor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления автора');
      }
      
      await fetchAuthors();
      setSelectedAuthor(null);
      setShowAuthorForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/Authors/${itemToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка удаления автора');
      }

      await fetchAuthors();
      if (selectedAuthor?.id === itemToDelete) {
        setSelectedAuthor(null);
      }
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.adminAuthorsContainer}>
      {/* <h1 className={styles.adminAuthorsTitle}>Управление авторами</h1> */}
      
      {error && <div className={styles.adminAuthorsError}>{error}</div>}
      {isLoading && <div className={styles.adminAuthorsLoading}>Загрузка...</div>}

      <div className={styles.adminAuthorsGrid}>
        {/* Секция списка авторов */}
        <div className={styles.adminAuthorsPanel}>
          <div className={styles.adminAuthorsPanelHeader}>
            <h2 className={styles.adminAuthorsPanelTitle}>Авторы</h2>
            <button 
              className={styles.adminAuthorsPrimaryBtn}
              onClick={() => {
                setSelectedAuthor(null);
                setShowAuthorForm(true);
              }}
            >
              Добавить автора
            </button>
          </div>

          {showAuthorForm ? (
            <AuthorForm
              author={selectedAuthor}
              onSubmit={selectedAuthor ? handleUpdateAuthor : handleCreateAuthor}
              onCancel={() => {
                setSelectedAuthor(null);
                setShowAuthorForm(false);
              }}
            />
          ) : (
            <>
              {authors.length === 0 ? (
                <div className={styles.adminAuthorsEmptyState}>
                  <div className={styles.adminAuthorsEmptyIcon}>✍️</div>
                  <p>Нет доступных авторов</p>
                </div>
              ) : (
                <ul className={styles.adminAuthorsList}>
                  {authors.map(author => (
                    <li 
                      key={author.id} 
                      className={`${styles.adminAuthorsListItem} ${
                        selectedAuthor?.id === author.id ? styles.adminAuthorsSelectedItem : ''
                      }`}
                      onClick={() => {
                        fetchAuthorDetails(author.id);
                        setShowAuthorForm(false);
                      }}
                    >
                      <div>
                        <strong>
                          {author.nickname || `${author.firstname} ${author.surname}`}
                        </strong>
                        <div className={styles.adminAuthorsDetails}>
                          {author.firstname} {author.surname}
                          {author.nickname && ` (${author.nickname})`}
                        </div>
                        <div className={styles.adminAuthorsUserId}>
                          ID пользователя: {author.idUser || 'не указан'}
                        </div>
                      </div>
                      <div className={styles.adminAuthorsActionButtons}>
                        <button 
                          className={styles.adminAuthorsSecondaryBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAuthor(author);
                            setShowAuthorForm(true);
                          }}
                        >
                          Редактировать
                        </button>
                        <button 
                          className={styles.adminAuthorsDeleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(author.id);
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Секция деталей автора */}
        <div className={styles.adminAuthorsPanel}>
          {selectedAuthor ? (
            <>
              <div className={styles.adminAuthorsPanelHeader}>
                <h2 className={styles.adminAuthorsPanelTitle}>
                  {selectedAuthor.nickname || 
                   `${selectedAuthor.firstname} ${selectedAuthor.surname}`}
                </h2>
              </div>

              <div className={styles.adminAuthorDetails}>
                <div className={styles.adminAuthorDetailRow}>
                  <span className={styles.adminAuthorDetailLabel}>Имя:</span>
                  <span>{selectedAuthor.firstname}</span>
                </div>
                <div className={styles.adminAuthorDetailRow}>
                  <span className={styles.adminAuthorDetailLabel}>Фамилия:</span>
                  <span>{selectedAuthor.surname}</span>
                </div>
                {selectedAuthor.nickname && (
                  <div className={styles.adminAuthorDetailRow}>
                    <span className={styles.adminAuthorDetailLabel}>Псевдоним:</span>
                    <span>{selectedAuthor.nickname}</span>
                  </div>
                )}
                <div className={styles.adminAuthorDetailRow}>
                  <span className={styles.adminAuthorDetailLabel}>ID пользователя:</span>
                  <span>{selectedAuthor.idUser || 'не указан'}</span>
                </div>

                <h3 className={styles.adminAuthorBooksTitle}>Книги автора</h3>
                {selectedAuthor.books && selectedAuthor.books.length > 0 ? (
                  <ul className={styles.adminAuthorBooksList}>
                    {selectedAuthor.books.map(book => (
                      <li key={book.id} className={styles.adminAuthorBookItem}>
                        <div className={styles.adminAuthorBookTitle}>{book.title}</div>
                        <div className={styles.adminAuthorBookDate}>
                          Опубликовано: {new Date(book.publishedDate).toLocaleDateString()}
                        </div>
                        {book.coverURL && (
                          <div className={styles.adminAuthorBookCover}>
                            <img 
                              src={book.coverURL} 
                              alt={`Обложка ${book.title}`} 
                              className={styles.adminAuthorBookCoverImage}
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.adminAuthorsEmptyState}>
                    <div className={styles.adminAuthorsEmptyIcon}>📚</div>
                    <p>Нет книг у этого автора</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.adminAuthorsEmptyState}>
              <div className={styles.adminAuthorsEmptyIcon}>👈</div>
              <p>Выберите автора для просмотра деталей</p>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <div className={styles.adminAuthorsModalOverlay}>
          <div className={styles.adminAuthorsModalContent}>
            <h3 className={styles.adminAuthorsModalTitle}>Подтверждение удаления</h3>
            <p className={styles.adminAuthorsModalText}>
              Вы уверены, что хотите удалить этого автора?
            </p>
            <div className={styles.adminAuthorsModalActions}>
              <button 
                className={styles.adminAuthorsSecondaryBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Отмена
              </button>
              <button 
                className={styles.adminAuthorsDeleteBtn}
                onClick={executeDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuthorsPage;