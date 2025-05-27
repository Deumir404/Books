import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Filters from '../../components/Filters/Filters';
import BookList from '../../components/BookList/BookList';
import Pagination from '../../components/Pagination/Pagination';
import styles from './Catalog.module.css';

const CatalogPage = () => {
  const location = useLocation();
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const booksPerPage = 50;

  const fetchBooks = useCallback(async () => {
    try {
      // Если есть результаты поиска, используем их
      if (location.state?.searchResults) {
        setSearchQuery(location.state.searchQuery || '');
        return location.state.searchResults;
      }
      
      // Иначе загружаем все книги
      const response = await axios.get('/Books/search');
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }, [location.state]);

  const fetchBookIdsByCategory = useCallback(async (categoryId) => {
    try {
      const response = await axios.get('/Books/search', {
        params: {
          category: [categoryId]
        }
      });
      return response.data.map(book => book.id);
    } catch (error) {
      console.error('Error fetching book IDs by category:', error);
      return [];
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      const [authorsRes, categoriesRes] = await Promise.all([
        axios.get('/authors'),
        axios.get('/categories')
      ]);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  }, []);

  const applyFilters = useCallback(async (booksToFilter) => {
    let result = [...booksToFilter];
    
    if (selectedCategories.length > 0) {
      try {
        const bookIdsPromises = selectedCategories.map(categoryId => 
          fetchBookIdsByCategory(categoryId)
        );
        const bookIdsArrays = await Promise.all(bookIdsPromises);
        const categoryBookIds = [...new Set(bookIdsArrays.flat())];
        
        result = result.filter(book => categoryBookIds.includes(book.id));
      } catch (error) {
        console.error('Error filtering books by categories:', error);
      }
    }
    
    if (selectedAuthors.length > 0) {
      result = result.filter(book => 
        book.author && selectedAuthors.includes(book.author.id)
      );
    }
    
    return result;
  }, [selectedCategories, selectedAuthors, fetchBookIdsByCategory]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchInitialData();
        const booksData = await fetchBooks();
        setAllBooks(booksData);
        const filtered = await applyFilters(booksData);
        setFilteredBooks(filtered);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchBooks, fetchInitialData, applyFilters]);

  useEffect(() => {
    const updateFilteredBooks = async () => {
      const filtered = await applyFilters(allBooks);
      setFilteredBooks(filtered);
      setCurrentPage(1);
    };
    
    updateFilteredBooks();
  }, [selectedCategories, selectedAuthors, allBooks, applyFilters]);

  const handleResetFilters = () => {
    setSelectedAuthors([]);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title': return a.title.localeCompare(b.title);
      case 'publishedDate': return new Date(b.publishedDate) - new Date(a.publishedDate);
      case 'publishedDateOld': return new Date(a.publishedDate) - new Date(b.publishedDate);
      case 'ratingHigh': return (b.rating || 0) - (a.rating || 0);
      case 'ratingLow': return (a.rating || 0) - (b.rating || 0);
      default: return 0;
    }
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

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
            onResetFilters={handleResetFilters}
          />
          <div className={styles.booksSection}>
            {searchQuery && (
              <div className={styles.searchResultsInfo}>
              </div>
            )}
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