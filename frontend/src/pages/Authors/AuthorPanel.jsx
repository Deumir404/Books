import React, { useState, useEffect, useCallback } from 'react';
import { getAuthToken, getUserData } from '../../utils/auth';
import styles from './AuthorPanel.module.css';

const AuthorPanel = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [],
    tags: []
  });
  const [chapterFormData, setChapterFormData] = useState({
    num: 0,
    title: '',
    text: ''
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: null });
  const [coverFile, setCoverFile] = useState(null);

  const getUserId = () => {
    const userData = getUserData();
    return userData?.id;
  };

  const fetchBooks = useCallback(async () => {
    try {
      // Получаем данные автора
      const authorResponse = await fetch('/Authors', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!authorResponse.ok) throw new Error('Ошибка загрузки данных автора');
      const authors = await authorResponse.json();
      
      // Находим автора текущего пользователя
      const currentAuthor = authors.find(author => author.idUser === getUserId());
      if (!currentAuthor) {
        setBooks([]);
        return;
      }
      
      // Получаем все книги
      const booksResponse = await fetch('/Books', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!booksResponse.ok) throw new Error('Ошибка загрузки книг');
      const allBooks = await booksResponse.json();
      
      // Фильтруем книги по автору
      const authorBooks = allBooks.filter(book => book.author?.id === currentAuthor.id);
      setBooks(authorBooks);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchBookDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/Books/${id}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки книги');
      const data = await response.json();
      setSelectedBook(data);
      setChapters(data.chapters || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/Categories', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки категорий');
      setCategories(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/Tags', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки тегов');
      setTags(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChapterDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/Books/Chapters/${id}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки главы');
      const data = await response.json();
      setSelectedChapter(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type, id) => {
    setFormData(prev => {
      const currentValues = prev[type];
      const newValues = currentValues.includes(id)
        ? currentValues.filter(v => v !== id)
        : [...currentValues, id];
      return { ...prev, [type]: newValues };
    });
  };

  const handleChapterInputChange = (e) => {
    const { name, value } = e.target;
    setChapterFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Сначала получаем ID автора
      const authorResponse = await fetch('/Authors', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!authorResponse.ok) throw new Error('Ошибка получения данных автора');
      const authors = await authorResponse.json();
      const currentAuthor = authors.find(author => author.idUser === getUserId());
      if (!currentAuthor) throw new Error('Автор не найден');

      const bookData = {
        ...formData,
        author: currentAuthor.id
      };

      const response = await fetch('/Books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания книги');
      }

      await fetchBooks();
      setShowBookForm(false);
      setFormData({
        title: '',
        description: '',
        categories: [],
        tags: []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      if (!selectedBook) return;
      setIsLoading(true);

      const response = await fetch(`/Books/${selectedBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления книги');
      }

      await fetchBooks();
      setSelectedBook(null);
      setShowBookForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    try {
      if (!selectedBook) return;
      setIsLoading(true);

      const chapterData = {
        ...chapterFormData,
        book: selectedBook.id
      };

      const response = await fetch('/Books/Chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(chapterData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания главы');
      }

      await fetchBookDetails(selectedBook.id);
      setShowChapterForm(false);
      setChapterFormData({
        num: 0,
        title: '',
        text: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateChapter = async (e) => {
    e.preventDefault();
    try {
      if (!selectedChapter) return;
      setIsLoading(true);

      const response = await fetch(`/Books/Chapters/${selectedChapter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(chapterFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления главы');
      }

      await fetchBookDetails(selectedBook.id);
      setSelectedChapter(null);
      setShowChapterForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    e.preventDefault();
    if (!coverFile || !selectedBook) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', coverFile);

      const response = await fetch(`/Books/${selectedBook.id}/cover`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки обложки');
      }

      await fetchBookDetails(selectedBook.id);
      setCoverFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    try {
      setIsLoading(true);
      const { type, id } = itemToDelete;
      
      const endpoint = type === 'book' 
        ? `/Books/${id}`
        : `/Books/Chapters/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Ошибка удаления ${type}`);
      }

      if (type === 'book') {
        await fetchBooks();
        if (selectedBook?.id === id) {
          setSelectedBook(null);
          setChapters([]);
        }
      } else {
        await fetchBookDetails(selectedBook.id);
        if (selectedChapter?.id === id) setSelectedChapter(null);
      }

      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchBooks(),
          fetchCategories(),
          fetchTags()
        ]);
      } catch (err) {
        setError('Ошибка загрузки данных: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [fetchBooks]);

  useEffect(() => {
    if (selectedBook && showBookForm) {
      setFormData({
        title: selectedBook.title || '',
        description: selectedBook.description || '',
        categories: selectedBook.categories?.map(c => c.id) || [],
        tags: selectedBook.tags?.map(t => t.id) || []
      });
    }
  }, [selectedBook, showBookForm]);

  useEffect(() => {
    if (selectedChapter && showChapterForm) {
      setChapterFormData({
        num: selectedChapter.num || 0,
        title: selectedChapter.title || '',
        text: selectedChapter.text || ''
      });
    }
  }, [selectedChapter, showChapterForm]);

  return (
    <div className={styles.authorPanel}>
      <h1 className={styles.authorPanelTitle}>Панель автора</h1>
      
      {error && <div className={styles.authorPanelError}>{error}</div>}
      {isLoading && <div className={styles.authorPanelLoading}>Загрузка...</div>}

      <div className={styles.authorPanelGrid}>
        {/* Секция книг */}
        <div className={styles.authorPanelSection}>
          <div className={styles.authorPanelHeader}>
            <h2 className={styles.authorPanelSectionTitle}>Мои книги</h2>
            <button 
              className={styles.authorPanelPrimaryBtn}
              onClick={() => {
                setSelectedBook(null);
                setShowBookForm(true);
              }}
            >
              Добавить книгу
            </button>
          </div>

          {showBookForm ? (
            <form onSubmit={selectedBook ? handleUpdateBook : handleCreateBook} className={styles.authorPanelForm}>
              <h3 className={styles.authorPanelFormTitle}>
                {selectedBook ? 'Редактировать книгу' : 'Добавить новую книгу'}
              </h3>
              
              <div className={styles.authorPanelFormGroup}>
                <label className={styles.authorPanelLabel}>Название</label>
                <input
                  type="text"
                  name="title"
                  className={styles.authorPanelInput}
                  value={formData.title}
                  onChange={handleBookInputChange}
                  required
                />
              </div>

              <div className={styles.authorPanelFormGroup}>
                <label className={styles.authorPanelLabel}>Описание</label>
                <textarea
                  name="description"
                  className={styles.authorPanelTextarea}
                  value={formData.description}
                  onChange={handleBookInputChange}
                  rows={8}
                />
              </div>

              <div className={styles.authorPanelFormGroup}>
                <label className={styles.authorPanelLabel}>Категории</label>
                <div className={styles.authorPanelCheckboxGroup}>
                  {categories.map(category => (
                    <label key={category.id} className={styles.authorPanelCheckboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={() => handleCheckboxChange('categories', category.id)}
                        className={styles.authorPanelCheckboxInput}
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.authorPanelFormGroup}>
                <label className={styles.authorPanelLabel}>Теги</label>
                <div className={styles.authorPanelCheckboxGroup}>
                  {tags.map(tag => (
                    <label key={tag.id} className={styles.authorPanelCheckboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag.id)}
                        onChange={() => handleCheckboxChange('tags', tag.id)}
                        className={styles.authorPanelCheckboxInput}
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.authorPanelFormActions}>
                <button 
                  type="button"
                  className={styles.authorPanelSecondaryBtn}
                  onClick={() => {
                    setSelectedBook(null);
                    setShowBookForm(false);
                  }}
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  className={styles.authorPanelPrimaryBtn}
                >
                  {selectedBook ? 'Сохранить' : 'Добавить книгу'}
                </button>
              </div>
            </form>
          ) : (
            <>
              {books.length === 0 ? (
                <div className={styles.authorPanelEmptyState}>
                  <div className={styles.authorPanelEmptyIcon}>📚</div>
                  <p>У вас пока нет книг</p>
                </div>
              ) : (
                <ul className={styles.authorPanelList}>
                  {books.map(book => (
                    <li 
                      key={book.id} 
                      className={`${styles.authorPanelListItem} ${
                        selectedBook?.id === book.id ? styles.authorPanelSelectedItem : ''
                      }`}
                      onClick={() => {
                        fetchBookDetails(book.id);
                        setShowBookForm(false);
                      }}
                    >
                      <div className={styles.authorPanelBookInfo}>
                        <div className={styles.authorPanelBookCover}>
                          <img 
                            src={book.coverURL || '/images/cover/empty.jpg'} 
                            alt={book.title} 
                            className={styles.authorPanelCoverImage} 
                          />
                        </div>
                        <div>
                          <h3 className={styles.authorPanelBookTitle}>{book.title}</h3>
                          <div className={styles.authorPanelBookMeta}>
                            {book.categories?.map(c => (
                              <span key={c.id} className={styles.authorPanelCategory}>{c.name}</span>
                            ))}
                          </div>
                          <div className={styles.authorPanelBookMeta}>
                            {book.tags?.map(t => (
                              <span key={t.id} className={styles.authorPanelTag}>#{t.name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className={styles.authorPanelActionButtons}>
                        <button 
                          className={styles.authorPanelSecondaryBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBook(book);
                            setShowBookForm(true);
                          }}
                        >
                          Редактировать
                        </button>
                        <button 
                          className={styles.authorPanelDeleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete('book', book.id);
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

        {/* Правая колонка */}
        <div className={styles.authorPanelSection}>
          {/* Секция глав */}
          {selectedBook && (
            <>
              <div className={styles.authorPanelHeader}>
                <h2 className={styles.authorPanelSectionTitle}>Главы: {selectedBook.title}</h2>
                <button 
                  className={styles.authorPanelPrimaryBtn}
                  onClick={() => {
                    setSelectedChapter(null);
                    setShowChapterForm(true);
                  }}
                >
                  Добавить главу
                </button>
              </div>

              {showChapterForm ? (
                <form onSubmit={selectedChapter ? handleUpdateChapter : handleCreateChapter} className={styles.authorPanelForm}>
                  <h3 className={styles.authorPanelFormTitle}>
                    {selectedChapter ? 'Редактировать главу' : 'Добавить новую главу'}
                  </h3>
                  
                  <div className={styles.authorPanelFormGroup}>
                    <label className={styles.authorPanelLabel}>Номер главы</label>
                    <input
                      type="number"
                      name="num"
                      className={styles.authorPanelInput}
                      value={chapterFormData.num}
                      onChange={handleChapterInputChange}
                      required
                      min="0"
                    />
                  </div>

                  <div className={styles.authorPanelFormGroup}>
                    <label className={styles.authorPanelLabel}>Название</label>
                    <input
                      type="text"
                      name="title"
                      className={styles.authorPanelInput}
                      value={chapterFormData.title}
                      onChange={handleChapterInputChange}
                      required
                    />
                  </div>

                  <div className={styles.authorPanelFormGroup}>
                    <label className={styles.authorPanelLabel}>Текст</label>
                    <textarea
                      name="text"
                      className={styles.authorPanelTextarea}
                      value={chapterFormData.text}
                      onChange={handleChapterInputChange}
                      rows={12}
                      required
                    />
                  </div>

                  <div className={styles.authorPanelFormActions}>
                    <button 
                      type="button"
                      className={styles.authorPanelSecondaryBtn}
                      onClick={() => {
                        setSelectedChapter(null);
                        setShowChapterForm(false);
                      }}
                    >
                      Отмена
                    </button>
                    <button 
                      type="submit"
                      className={styles.authorPanelPrimaryBtn}
                    >
                      {selectedChapter ? 'Сохранить' : 'Добавить главу'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {chapters.length === 0 ? (
                    <div className={styles.authorPanelEmptyState}>
                      <div className={styles.authorPanelEmptyIcon}>📖</div>
                      <p>Нет доступных глав</p>
                    </div>
                  ) : (
                    <ul className={styles.authorPanelList}>
                      {chapters.map(chapter => (
                        <li 
                          key={chapter.id}
                          className={`${styles.authorPanelListItem} ${
                            selectedChapter?.id === chapter.id ? styles.authorPanelSelectedItem : ''
                          }`}
                          onClick={() => fetchChapterDetails(chapter.id)}
                        >
                          <div>
                            <h3 className={styles.authorPanelChapterTitle}>Глава {chapter.num}: {chapter.title}</h3>
                            <div className={styles.authorPanelChapterDate}>
                              {new Date(chapter.publishedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className={styles.authorPanelActionButtons}>
                            <button 
                              className={styles.authorPanelSecondaryBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedChapter(chapter);
                                setShowChapterForm(true);
                              }}
                            >
                              Редактировать
                            </button>
                            <button 
                              className={styles.authorPanelDeleteBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete('chapter', chapter.id);
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
            </>
          )}

          {/* Секция загрузки обложки */}
          {selectedBook && !showChapterForm && (
            <div className={styles.authorPanelUploadSection}>
              <h3 className={styles.authorPanelSectionTitle}>Обложка книги</h3>
              <form onSubmit={handleCoverUpload} className={styles.authorPanelForm}>
                <div className={styles.authorPanelFormGroup}>
                  <label className={styles.authorPanelLabel}>Выберите файл обложки</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.authorPanelFileInput}
                    onChange={(e) => setCoverFile(e.target.files[0])}
                  />
                </div>
                <button 
                  type="submit"
                  className={styles.authorPanelPrimaryBtn}
                  disabled={!coverFile}
                >
                  Загрузить обложку
                </button>
              </form>
              {selectedBook.coverURL && (
                <div className={styles.authorPanelCurrentCover}>
                  <p>Текущая обложка:</p>
                  <img 
                    src={selectedBook.coverURL} 
                    alt={`Обложка ${selectedBook.title}`} 
                    className={styles.authorPanelCoverPreview}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <div className={styles.authorPanelModalOverlay}>
          <div className={styles.authorPanelModalContent}>
            <h3 className={styles.authorPanelModalTitle}>Подтверждение удаления</h3>
            <p className={styles.authorPanelModalText}>
              Вы уверены, что хотите удалить эту {itemToDelete.type === 'book' ? 'книгу' : 'главу'}?
            </p>
            <div className={styles.authorPanelModalActions}>
              <button 
                className={styles.authorPanelSecondaryBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Отмена
              </button>
              <button 
                className={styles.authorPanelDeleteBtn}
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

export default AuthorPanel;