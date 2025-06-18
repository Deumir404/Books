import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../../utils/auth';
import styles from './AdminBooks.module.css';

const AdminBooksPage = () => {
  // Состояния
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    categories: [],
    tags: []
  });
  const [chapterForm, setChapterForm] = useState({
    num: 0,
    title: '',
    text: '',
    book: null
  });
  const [tagForm, setTagForm] = useState({ name: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: null });

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
      setFormData({
        title: data.title,
        description: data.description,
        author: data.author?.id || '',
        categories: data.categories?.map(c => c.id) || [],
        tags: data.tags?.map(t => t.id) || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Аналогичные функции для tags, categories, authors, chapters...
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
      setChapterForm({
        num: data.num,
        title: data.title,
        text: data.text,
        book: data.book
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчики
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: selectedValues }));
  };

  const handleChapterInputChange = (e) => {
    const { name, value } = e.target;
    setChapterForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e) => {
    const { name, value } = e.target;
    setTagForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({ ...prev, [name]: value }));
  };

  // CRUD операции
  const createBook = async () => {
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
      if (!response.ok) throw new Error('Ошибка создания книги');
      await fetchBooks();
      setFormData({
        title: '',
        description: '',
        author: '',
        categories: [],
        tags: []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBook = async () => {
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
      if (!response.ok) throw new Error('Ошибка обновления книги');
      await fetchBooks();
      await fetchBookDetails(selectedBook.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createChapter = async () => {
    try {
      if (!selectedBook) return;
      setIsLoading(true);
      const chapterData = {
        ...chapterForm,
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
      if (!response.ok) throw new Error('Ошибка создания главы');
      await fetchBookDetails(selectedBook.id);
      setChapterForm({
        num: 0,
        title: '',
        text: '',
        book: null
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChapter = async () => {
    try {
      if (!selectedChapter) return;
      setIsLoading(true);
      const response = await fetch(`/api/Books/Chapters/${selectedChapter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(chapterForm)
      });
      if (!response.ok) throw new Error('Ошибка обновления главы');
      await fetchBookDetails(selectedBook.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createTag = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(tagForm)
      });
      if (!response.ok) throw new Error('Ошибка создания тега');
      await fetchTags();
      setTagForm({ name: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTag = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/Tags/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(tagForm)
      });
      if (!response.ok) throw new Error('Ошибка обновления тега');
      await fetchTags();
      setTagForm({ name: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(categoryForm)
      });
      if (!response.ok) throw new Error('Ошибка создания категории');
      await fetchCategories();
      setCategoryForm({ name: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/Categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(categoryForm)
      });
      if (!response.ok) throw new Error('Ошибка обновления категории');
      await fetchCategories();
      setCategoryForm({ name: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Удаление
  const confirmDelete = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    try {
      setIsLoading(true);
      const { type, id } = itemToDelete;
      const endpoint = `/api/${type === 'chapter' ? 'Books/Chapters' : type}s/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (!response.ok) throw new Error(`Ошибка удаления ${type}`);

      // Обновление данных
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
          // Handle unexpected types or do nothing
          console.warn(`Unexpected type for deletion: ${type}`);
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
      <h1 className={styles.adminBooksTitle}>Управление книгами</h1>
      
      {error && <div className={styles.adminBooksError}>{error}</div>}
      {isLoading && <div className={styles.adminBooksLoading}>Загрузка...</div>}

      <div className={styles.adminBooksGrid}>
        {/* Секция книг */}
        <div className={styles.adminBooksPanel}>
          <div className={styles.adminBooksPanelHeader}>
            <h2 className={styles.adminBooksPanelTitle}>Книги</h2>
          </div>

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
                  onClick={() => fetchBookDetails(book.id)}
                >
                  <div>
                    <strong>{book.title}</strong>
                    <div className={styles.adminBooksAuthor}>
                      {book.author?.nickname || `${book.author?.firstname} ${book.author?.surname}`}
                    </div>
                  </div>
                  <button 
                    className={styles.adminBooksDeleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete('book', book.id);
                    }}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.adminBooksForm}>
            <h3 className={styles.adminBooksFormTitle}>
              {selectedBook ? 'Редактировать книгу' : 'Добавить новую книгу'}
            </h3>
            
            <div className={styles.adminBooksFormGroup}>
              <label className={styles.adminBooksLabel}>Название</label>
              <input
                type="text"
                name="title"
                className={styles.adminBooksInput}
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.adminBooksFormGroup}>
              <label className={styles.adminBooksLabel}>Описание</label>
              <textarea
                name="description"
                className={styles.adminBooksTextarea}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.adminBooksFormGroup}>
              <label className={styles.adminBooksLabel}>Автор</label>
              <select
                name="author"
                className={styles.adminBooksSelect}
                value={formData.author}
                onChange={handleInputChange}
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
              <select
                name="categories"
                className={`${styles.adminBooksSelect} ${styles.adminBooksMultiSelect}`}
                multiple
                value={formData.categories}
                onChange={handleMultiSelectChange}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.adminBooksFormGroup}>
              <label className={styles.adminBooksLabel}>Теги</label>
              <select
                name="tags"
                className={`${styles.adminBooksSelect} ${styles.adminBooksMultiSelect}`}
                multiple
                value={formData.tags}
                onChange={handleMultiSelectChange}
              >
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.adminBooksFormActions}>
              {selectedBook ? (
                <>
                  <button 
                    className={styles.adminBooksPrimaryBtn}
                    onClick={updateBook}
                  >
                    Обновить
                  </button>
                  <button 
                    className={styles.adminBooksSecondaryBtn}
                    onClick={() => {
                      setSelectedBook(null);
                      setFormData({
                        title: '',
                        description: '',
                        author: '',
                        categories: [],
                        tags: []
                      });
                    }}
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <button 
                  className={styles.adminBooksPrimaryBtn}
                  onClick={createBook}
                >
                  Добавить
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Правая колонка */}
        <div className={styles.adminBooksPanel}>
          {/* Секция глав */}
          {selectedBook && (
            <>
              <div className={styles.adminBooksPanelHeader}>
                <h2 className={styles.adminBooksPanelTitle}>Главы: {selectedBook.title}</h2>
              </div>

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
                      <button 
                        className={styles.adminBooksDeleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete('chapter', chapter.id);
                        }}
                      >
                        Удалить
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.adminBooksForm}>
                <h3 className={styles.adminBooksFormTitle}>
                  {selectedChapter ? 'Редактировать главу' : 'Добавить новую главу'}
                </h3>
                
                <div className={styles.adminBooksFormGroup}>
                  <label className={styles.adminBooksLabel}>Номер главы</label>
                  <input
                    type="number"
                    name="num"
                    className={styles.adminBooksInput}
                    value={chapterForm.num}
                    onChange={handleChapterInputChange}
                  />
                </div>

                <div className={styles.adminBooksFormGroup}>
                  <label className={styles.adminBooksLabel}>Название</label>
                  <input
                    type="text"
                    name="title"
                    className={styles.adminBooksInput}
                    value={chapterForm.title}
                    onChange={handleChapterInputChange}
                  />
                </div>

                <div className={styles.adminBooksFormGroup}>
                  <label className={styles.adminBooksLabel}>Текст</label>
                  <textarea
                    name="text"
                    className={styles.adminBooksTextarea}
                    value={chapterForm.text}
                    onChange={handleChapterInputChange}
                  />
                </div>

                <div className={styles.adminBooksFormActions}>
                  {selectedChapter ? (
                    <>
                      <button 
                        className={styles.adminBooksPrimaryBtn}
                        onClick={updateChapter}
                      >
                        Обновить
                      </button>
                      <button 
                        className={styles.adminBooksSecondaryBtn}
                        onClick={() => {
                          setSelectedChapter(null);
                          setChapterForm({
                            num: 0,
                            title: '',
                            text: '',
                            book: null
                          });
                        }}
                      >
                        Отмена
                      </button>
                    </>
                  ) : (
                    <button 
                      className={styles.adminBooksPrimaryBtn}
                      onClick={createChapter}
                    >
                      Добавить
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Секция тегов */}
          <div className={styles.adminBooksPanelHeader}>
            <h2 className={styles.adminBooksPanelTitle}>Теги</h2>
          </div>

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
                        setTagForm({ name: tag.name });
                        updateTag(tag.id);
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

          <div className={styles.adminBooksForm}>
            <h3 className={styles.adminBooksFormTitle}>Добавить новый тег</h3>
            <div className={styles.adminBooksFormGroup}>
              <input
                type="text"
                name="name"
                className={styles.adminBooksInput}
                placeholder="Название тега"
                value={tagForm.name}
                onChange={handleTagInputChange}
              />
            </div>
            <button 
              className={styles.adminBooksPrimaryBtn}
              onClick={createTag}
            >
              Добавить тег
            </button>
          </div>

          {/* Секция категорий */}
          <div className={styles.adminBooksPanelHeader}>
            <h2 className={styles.adminBooksPanelTitle}>Категории</h2>
          </div>

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
                        setCategoryForm({ name: category.name });
                        updateCategory(category.id);
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

          <div className={styles.adminBooksForm}>
            <h3 className={styles.adminBooksFormTitle}>Добавить новую категорию</h3>
            <div className={styles.adminBooksFormGroup}>
              <input
                type="text"
                name="name"
                className={styles.adminBooksInput}
                placeholder="Название категории"
                value={categoryForm.name}
                onChange={handleCategoryInputChange}
              />
            </div>
            <button 
              className={styles.adminBooksPrimaryBtn}
              onClick={createCategory}
            >
              Добавить категорию
            </button>
          </div>
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