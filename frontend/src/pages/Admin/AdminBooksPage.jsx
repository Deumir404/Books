import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../../utils/auth';
import styles from './AdminBooks.module.css';

// Компонент формы для работы с книгами
const BookForm = ({ 
  book = null, 
  authors = [], 
  categories = [], 
  tags = [], 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    categories: [],
    tags: []
  });
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);

  useEffect(() => {
    if (book) {
      const initialData = {
        title: book.title || '',
        author: book.author?.id || '',
        categories: book.categories?.map(c => c.id) || [],
        tags: book.tags?.map(t => t.id) || [],
        description: book.description?.length > 1000 ? '' : book.description || ''
      };

      setFormData(initialData);

      // Если описание большое - загружаем полный текст
      if (book.description && book.description.length > 1000) {
        loadFullDescription(book.id);
      }
    }
  }, [book]);

  const loadFullDescription = async (bookId) => {
    try {
      setIsLoadingDescription(true);
      const response = await fetch(`/api/Books/${bookId}/fulldescription`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, description: data.description }));
      }
    } catch (err) {
      console.error('Ошибка загрузки полного описания:', err);
    } finally {
      setIsLoadingDescription(false);
    }
  };

  const handleInputChange = (e) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isSelected = (type, id) => formData[type].includes(id);

  return (
    <form onSubmit={handleSubmit} className={styles.adminBooksForm}>
      <h3 className={styles.adminBooksFormTitle}>
        {book ? 'Редактировать книгу' : 'Добавить новую книгу'}
      </h3>
      
      <div className={styles.adminBooksFormGroup}>
        <label className={styles.adminBooksLabel}>Название</label>
        <input
          type="text"
          name="title"
          className={styles.adminBooksInput}
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.adminBooksFormGroup}>
        <label className={styles.adminBooksLabel}>Описание</label>
        {isLoadingDescription ? (
          <div className={styles.adminBooksLoadingText}>Загрузка полного описания...</div>
        ) : (
          <textarea
            name="description"
            className={styles.adminBooksTextarea}
            value={formData.description}
            onChange={handleInputChange}
            rows={8}
          />
        )}
      </div>

      <div className={styles.adminBooksFormGroup}>
        <label className={styles.adminBooksLabel}>Автор</label>
        <select
          name="author"
          className={styles.adminBooksSelect}
          value={formData.author}
          onChange={handleInputChange}
          required
        >
          <option value="">Выберите автора</option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>
              {author.nickname || `${author.firstname} ${author.surname}`}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.adminBooksFormGroup}>
        <label className={styles.adminBooksLabel}>Категории</label>
        <div className={styles.adminBooksCheckboxGroup}>
          {categories.map(category => (
            <label 
              key={category.id} 
              className={`${styles.adminBooksCheckboxLabel} ${
                isSelected('categories', category.id) ? styles.adminBooksSelectedCheckbox : ''
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected('categories', category.id)}
                onChange={() => handleCheckboxChange('categories', category.id)}
                className={styles.adminBooksCheckboxInput}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.adminBooksFormGroup}>
        <label className={styles.adminBooksLabel}>Теги</label>
        <div className={styles.adminBooksCheckboxGroup}>
          {tags.map(tag => (
            <label 
              key={tag.id} 
              className={`${styles.adminBooksCheckboxLabel} ${
                isSelected('tags', tag.id) ? styles.adminBooksSelectedCheckbox : ''
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected('tags', tag.id)}
                onChange={() => handleCheckboxChange('tags', tag.id)}
                className={styles.adminBooksCheckboxInput}
              />
              {tag.name}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.adminBooksFormActions}>
        {onCancel && (
          <button 
            type="button"
            className={styles.adminBooksSecondaryBtn}
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
        <button 
          type="submit"
          className={styles.adminBooksPrimaryBtn}
        >
          {book ? 'Сохранить' : 'Добавить книгу'}
        </button>
      </div>
    </form>
  );
};

// Компонент формы для работы с главами
const ChapterForm = ({ 
  chapter = null, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    num: 0,
    title: '',
    text: ''
  });
  const [isLoadingFullText, setIsLoadingFullText] = useState(false);

  useEffect(() => {
    if (chapter) {
      const initialData = {
        num: chapter.num || 0,
        title: chapter.title || '',
        text: chapter.text?.length > 1000 ? '' : chapter.text || ''
      };

      setFormData(initialData);

      // Если текст большой - загружаем полный текст
      if (chapter.text && chapter.text.length > 1000) {
        loadFullText(chapter.id);
      }
    }
  }, [chapter]);

  const loadFullText = async (chapterId) => {
    try {
      setIsLoadingFullText(true);
      const response = await fetch(`/api/Books/Chapters/${chapterId}/fulltext`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, text: data.text }));
      }
    } catch (err) {
      console.error('Ошибка загрузки полного текста главы:', err);
    } finally {
      setIsLoadingFullText(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.adminBooksForm}>
      <h3 className={styles.adminBooksFormTitle}>
        {chapter ? 'Редактировать главу' : 'Добавить новую главу'}
      </h3>
      
      <div className={styles.adminBooksFormGroup}>
        <label className={styles.adminBooksLabel}>Номер главы</label>
        <input
          type="number"
          name="num"
          className={styles.adminBooksInput}
          value={formData.num}
          onChange={handleInputChange}
          required
          min="0"
        />
      </div>

      <div className={styles.adminBooksFormGroup}>
        <label className={styles.adminBooksLabel}>Название</label>
        <input
          type="text"
          name="title"
          className={styles.adminBooksInput}
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.adminBooksFormGroup}>
        <label className={styles.adminBooksLabel}>Текст</label>
        {isLoadingFullText ? (
          <div className={styles.adminBooksLoadingText}>Загрузка полного текста...</div>
        ) : (
          <textarea
            name="text"
            className={styles.adminBooksTextarea}
            value={formData.text}
            onChange={handleInputChange}
            rows={12}
            required
          />
        )}
      </div>

      <div className={styles.adminBooksFormActions}>
        {onCancel && (
          <button 
            type="button"
            className={styles.adminBooksSecondaryBtn}
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
        <button 
          type="submit"
          className={styles.adminBooksPrimaryBtn}
        >
          {chapter ? 'Сохранить' : 'Добавить главу'}
        </button>
      </div>
    </form>
  );
};

// Компонент формы для работы с тегами и категориями
const SimpleForm = ({ 
  item = null, 
  onSubmit, 
  onCancel,
  placeholder = '',
  title = ''
}) => {
  const [name, setName] = useState(item?.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.adminBooksForm}>
      <h3 className={styles.adminBooksFormTitle}>
        {item ? `Редактировать ${title}` : `Добавить новый ${title}`}
      </h3>
      
      <div className={styles.adminBooksFormGroup}>
        <input
          type="text"
          className={styles.adminBooksInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          required
        />
      </div>

      <div className={styles.adminBooksFormActions}>
        {onCancel && (
          <button 
            type="button"
            className={styles.adminBooksSecondaryBtn}
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
        <button 
          type="submit"
          className={styles.adminBooksPrimaryBtn}
        >
          {item ? 'Сохранить' : `Добавить ${title}`}
        </button>
      </div>
    </form>
  );
};

// Основной компонент страницы администрирования книг
const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  
  // Состояния для отображения форм
  const [showBookForm, setShowBookForm] = useState(false);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  
  // Состояния для модальных окон
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: null });
  
  // Общие состояния
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchBooks(),
          fetchTags(),
          fetchCategories(),
          fetchAuthors()
        ]);
      } catch (err) {
        setError('Ошибка загрузки данных: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // API функции
  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/Books', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки книг');
      setBooks(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBookDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/Books/${id}`, {
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

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/Tags', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки тегов');
      setTags(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/Categories', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки категорий');
      setCategories(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/Authors', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error('Ошибка загрузки авторов');
      setAuthors(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChapterDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/Books/Chapters/${id}`, {
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

  // CRUD операции для книг
  const handleCreateBook = async (formData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания книги');
      }
      
      await fetchBooks();
      setShowBookForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBook = async (formData) => {
    try {
      if (!selectedBook) return;
      setIsLoading(true);
      
      const response = await fetch(`/api/Books/${selectedBook.id}`, {
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

  // CRUD операции для глав
  const handleCreateChapter = async (formData) => {
    try {
      if (!selectedBook) return;
      setIsLoading(true);
      const chapterData = {
        ...formData,
        book: selectedBook.id
      };
      const response = await fetch('/api/Books/Chapters', {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateChapter = async (formData) => {
    try {
      if (!selectedChapter) return;
      setIsLoading(true);
      const response = await fetch(`/api/Books/Chapters/${selectedChapter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
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

  // CRUD операции для тегов
  const handleCreateTag = async (formData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания тега');
      }
      
      await fetchTags();
      setShowTagForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD операции для категорий
  const handleCreateCategory = async (formData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания категории');
      }
      
      await fetchCategories();
      setShowCategoryForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление элементов
  const confirmDelete = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    try {
      setIsLoading(true);
      const { type, id } = itemToDelete;
      
      const endpoint = type === 'category' 
        ? `/api/Categories/${id}`
        : `/api/${type === 'chapter' ? 'Books/Chapters' : type}s/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Ошибка удаления ${type}`);
      }

      switch (type) {
        case 'book':
          await fetchBooks();
          if (selectedBook?.id === id) {
            setSelectedBook(null);
            setChapters([]);
          }
          break;
        case 'chapter':
          await fetchBookDetails(selectedBook.id);
          if (selectedChapter?.id === id) setSelectedChapter(null);
          break;
        case 'tag':
          await fetchTags();
          break;
        case 'category':
          await fetchCategories();
          break;
        default:
          break;
      }

      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.adminBooksContainer}>
      {/* <h1 className={styles.adminBooksTitle}>Управление книгами</h1> */}
      
      {error && <div className={styles.adminBooksError}>{error}</div>}
      {isLoading && <div className={styles.adminBooksLoading}>Загрузка...</div>}

      <div className={styles.adminBooksGrid}>
        {/* Секция книг */}
        <div className={styles.adminBooksPanel}>
          <div className={styles.adminBooksPanelHeader}>
            <h2 className={styles.adminBooksPanelTitle}>Книги</h2>
            <button 
              className={styles.adminBooksPrimaryBtn}
              onClick={() => {
                setSelectedBook(null);
                setShowBookForm(true);
              }}
            >
              Добавить книгу
            </button>
          </div>

          {showBookForm ? (
            <BookForm
              book={selectedBook}
              authors={authors}
              categories={categories}
              tags={tags}
              onSubmit={selectedBook ? handleUpdateBook : handleCreateBook}
              onCancel={() => {
                setSelectedBook(null);
                setShowBookForm(false);
              }}
            />
          ) : (
            <>
              {books.length === 0 ? (
                <div className={styles.adminBooksEmptyState}>
                  <div className={styles.adminBooksEmptyIcon}>📚</div>
                  <p>Нет доступных книг</p>
                </div>
              ) : (
                <ul className={styles.adminBooksList}>
                  {books.map(book => (
                    <li 
                      key={book.id} 
                      className={`${styles.adminBooksListItem} ${
                        selectedBook?.id === book.id ? styles.adminBooksSelectedItem : ''
                      }`}
                      onClick={() => {
                        fetchBookDetails(book.id);
                        setShowBookForm(false);
                      }}
                    >
                      <div>
                        <strong>{book.title}</strong>
                        <div className={styles.adminBooksAuthor}>
                          {book.author?.nickname || `${book.author?.firstname} ${book.author?.surname}`}
                        </div>
                        <div className={styles.adminBooksTags}>
                          {book.tags?.map(tag => (
                            <span key={tag.id} className={styles.adminBooksTag}>
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={styles.adminBooksActionButtons}>
                        <button 
                          className={styles.adminBooksSecondaryBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBook(book);
                            setShowBookForm(true);
                          }}
                        >
                          Редактировать
                        </button>
                        <button 
                          className={styles.adminBooksDeleteBtn}
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
        <div className={styles.adminBooksPanel}>
          {/* Секция глав */}
          {selectedBook && (
            <>
              <div className={styles.adminBooksPanelHeader}>
                <h2 className={styles.adminBooksPanelTitle}>Главы: {selectedBook.title}</h2>
                <button 
                  className={styles.adminBooksPrimaryBtn}
                  onClick={() => {
                    setSelectedChapter(null);
                    setShowChapterForm(true);
                  }}
                >
                  Добавить главу
                </button>
              </div>

              {showChapterForm ? (
                <ChapterForm
                  chapter={selectedChapter}
                  onSubmit={selectedChapter ? handleUpdateChapter : handleCreateChapter}
                  onCancel={() => {
                    setSelectedChapter(null);
                    setShowChapterForm(false);
                  }}
                />
              ) : (
                <>
                  {chapters.length === 0 ? (
                    <div className={styles.adminBooksEmptyState}>
                      <div className={styles.adminBooksEmptyIcon}>📖</div>
                      <p>Нет доступных глав</p>
                    </div>
                  ) : (
                    <ul className={styles.adminBooksList}>
                      {chapters.map(chapter => (
                        <li 
                          key={chapter.id}
                          className={`${styles.adminBooksListItem} ${
                            selectedChapter?.id === chapter.id ? styles.adminBooksSelectedItem : ''
                          }`}
                          onClick={() => fetchChapterDetails(chapter.id)}
                        >
                          <div>
                            <strong>Глава {chapter.num}: {chapter.title}</strong>
                            <div className={styles.adminBooksDate}>
                              {new Date(chapter.publishedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className={styles.adminBooksActionButtons}>
                            <button 
                              className={styles.adminBooksSecondaryBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedChapter(chapter);
                                setShowChapterForm(true);
                              }}
                            >
                              Редактировать
                            </button>
                            <button 
                              className={styles.adminBooksDeleteBtn}
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

          {/* Секция тегов */}
          <div className={styles.adminBooksPanelHeader}>
            <h2 className={styles.adminBooksPanelTitle}>Теги</h2>
            <button 
              className={styles.adminBooksPrimaryBtn}
              onClick={() => {
                setShowTagForm(true);
              }}
            >
              Добавить тег
            </button>
          </div>

          {showTagForm ? (
            <SimpleForm
              onSubmit={handleCreateTag}
              onCancel={() => setShowTagForm(false)}
              placeholder="Название тега"
              title="тег"
            />
          ) : (
            <>
              {tags.length === 0 ? (
                <div className={styles.adminBooksEmptyState}>
                  <div className={styles.adminBooksEmptyIcon}>🏷️</div>
                  <p>Нет доступных тегов</p>
                </div>
              ) : (
                <ul className={styles.adminBooksList}>
                  {tags.map(tag => (
                    <li key={tag.id} className={styles.adminBooksListItem}>
                      <span className={styles.adminBooksTag}>{tag.name}</span>
                      <div className={styles.adminBooksActionButtons}>
                        <button 
                          className={styles.adminBooksSecondaryBtn}
                          onClick={() => {
                            setItemToDelete({ type: 'tag', data: tag });
                            setShowTagForm(true);
                          }}
                        >
                          Редактировать
                        </button>
                        <button 
                          className={styles.adminBooksDeleteBtn}
                          onClick={() => confirmDelete('tag', tag.id)}
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

          {/* Секция категорий */}
          <div className={styles.adminBooksPanelHeader}>
            <h2 className={styles.adminBooksPanelTitle}>Категории</h2>
            <button 
              className={styles.adminBooksPrimaryBtn}
              onClick={() => {
                setShowCategoryForm(true);
              }}
            >
              Добавить категорию
            </button>
          </div>

          {showCategoryForm ? (
            <SimpleForm
              onSubmit={handleCreateCategory}
              onCancel={() => setShowCategoryForm(false)}
              placeholder="Название категории"
              title="категорию"
            />
          ) : (
            <>
              {categories.length === 0 ? (
                <div className={styles.adminBooksEmptyState}>
                  <div className={styles.adminBooksEmptyIcon}>🗂️</div>
                  <p>Нет доступных категорий</p>
                </div>
              ) : (
                <ul className={styles.adminBooksList}>
                  {categories.map(category => (
                    <li key={category.id} className={styles.adminBooksListItem}>
                      <span className={styles.adminBooksCategory}>{category.name}</span>
                      <div className={styles.adminBooksActionButtons}>
                        <button 
                          className={styles.adminBooksSecondaryBtn}
                          onClick={() => {
                            setItemToDelete({ type: 'category', data: category });
                            setShowCategoryForm(true);
                          }}
                        >
                          Редактировать
                        </button>
                        <button 
                          className={styles.adminBooksDeleteBtn}
                          onClick={() => confirmDelete('category', category.id)}
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
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <div className={styles.adminBooksModalOverlay}>
          <div className={styles.adminBooksModalContent}>
            <h3 className={styles.adminBooksModalTitle}>Подтверждение удаления</h3>
            <p className={styles.adminBooksModalText}>
              Вы уверены, что хотите удалить этот {itemToDelete.type}?
            </p>
            <div className={styles.adminBooksModalActions}>
              <button 
                className={styles.adminBooksSecondaryBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Отмена
              </button>
              <button 
                className={styles.adminBooksDeleteBtn}
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

export default AdminBooksPage;