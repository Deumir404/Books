import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from '../../components/Filters/Filters';
import BookList from '../../components/BookList/BookList';
import Pagination from '../../components/Pagination/Pagination';
import styles from './Catalog.css';

const CatalogPage = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, authorsRes, categoriesRes] = await Promise.all([
          axios.get('/books'),
          axios.get('/authors'),
          axios.get('/categories')
        ]);
        setBooks(booksRes.data);
        setAuthors(authorsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = books.filter(book => {
    const authorMatch = selectedAuthors.length === 0 || 
      (book.author && selectedAuthors.includes(book.author.id));
    const categoryMatch = selectedCategories.length === 0 || 
      (book.category && selectedCategories.includes(book.category.idCategory));
    return authorMatch && categoryMatch;
  });

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
    setCurrentPage(1);
  };

  const handleAuthorChange = (authorId) => {
    setSelectedAuthors(prev => 
      prev.includes(authorId) ? prev.filter(id => id !== authorId) : [...prev, authorId]
    );
    setCurrentPage(1);
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