import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Filters from '../../components/Filters/Filters';
import BookList from '../../components/BookList/BookList';
import Pagination from '../../components/Pagination/Pagination';
import styles from './Catalog.module.css';

const CatalogPage = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [titleQuery, setTitleQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 50;

  // Загрузка всех данных
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Загружаем основные данные
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        axios.get('/books'),
        axios.get('/authors'),
        axios.get('/categories')
      ]);

      // Для каждой книги получаем категории через отдельный запрос
      const booksWithCategories = await Promise.all(
        booksRes.data.map(async book => {
          try {
            const categoryRes = await axios.get(`/Books/search?category=${book.id}`);
            return {
              ...book,
              categories: categoryRes.data // Добавляем категории к данным книги
            };
          } catch (error) {
            console.error(`Error loading categories for book ${book.id}:`, error);
            return {
              ...book,
              categories: []
            };
          }
        })
      );

      setAllBooks(booksWithCategories);
      setBooks(booksWithCategories);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Фильтрация книг
  useEffect(() => {
    let filteredBooks = [...allBooks];

    // Фильтрация по авторам
    if (selectedAuthors.length > 0) {
      filteredBooks = filteredBooks.filter(book => 
        book.author && selectedAuthors.includes(book.author.id)
      );
    }

    // Фильтрация по категориям
    if (selectedCategories.length > 0) {
      filteredBooks = filteredBooks.filter(book => {
        // Проверяем, есть ли у книги категории из выбранных
        return book.categories && book.categories.some(category => 
          selectedCategories.includes(category.id)
        );
      });
    }

    // Фильтрация по названию
    if (titleQuery) {
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(titleQuery.toLowerCase())
      );
    }
    console.log('Filtered books:', filteredBooks);
    setBooks(filteredBooks);
    setCurrentPage(1);
  }, [selectedAuthors, selectedCategories, titleQuery, allBooks]);

  // Сортировка книг
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'publishedDate': return new Date(b.publishedDate) - new Date(a.publishedDate);
      case 'publishedDateOld': return new Date(a.publishedDate) - new Date(b.publishedDate);
      case 'ratingHigh': return (b.rating || 0) - (a.rating || 0);
      case 'ratingLow': return (a.rating || 0) - (b.rating || 0);
      default: return 0;
    }
  });

  // Пагинация
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  // Обработчики изменений
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleAuthorChange = (authorId) => {
    setSelectedAuthors(prev => 
      prev.includes(authorId) ? prev.filter(id => id !== authorId) : [...prev, authorId]
    );
  };

  const handleTitleChange = (title) => {
    setTitleQuery(title);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.catalogContainer}>
        <div className={styles.catalogContent}>
          <Filters 
            categories={categories}
            authors={authors}
            selectedCategories={selectedCategories}
            selectedAuthors={selectedAuthors}
            onCategoryChange={handleCategoryChange}
            onAuthorChange={handleAuthorChange}
            onTitleChange={handleTitleChange}
            titleQuery={titleQuery}
          />
          <div className={styles.booksSection}>
            <BookList 
              books={currentBooks} 
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;