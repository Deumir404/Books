import React, { useState } from 'react';
import Filters from '../../components/Filters/Filters';
import BookList from '../../components/BookList/BookList';
import Pagination from '../../components/Pagination/Pagination';
import styles from './Catalog.css';

const CatalogPage = () => {
  // Тестовые данные
  const allCategories = [
    'Художественная', 'Наука', 'История', 
    'Психология', 'Кулинария', 'Детские', 'Фантастика', 'Бизнес'
  ];

  const allAuthors = [
    'Михаил Булгаков', 'Фёдор Достоевский', 'Лев Толстой',
    'Александр Пушкин', 'Борис Пастернак', 'Стивен Кинг',
    'Джоан Роулинг', 'Дэн Браун', 'Джейн Остин'
  ];

  const testBooks = [
    { id: 1, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', category: 'Художественная', price: 450, rating: 4.8, cover: '...' },
    { id: 2, title: 'Преступление и наказание', author: 'Фёдор Достоевский', category: 'Художественная', price: 390, rating: 4.7, cover: '...' },
    { id: 3, title: 'Война и мир', author: 'Лев Толстой', category: 'Художественная', price: 520, rating: 4.9, cover: '...' },
    { id: 4, title: 'Евгений Онегин', author: 'Александр Пушкин', category: 'Художественная', price: 350, rating: 4.6, cover: '...' },
    { id: 5, title: 'Доктор Живаго', author: 'Борис Пастернак', category: 'Художественная', price: 420, rating: 4.5, cover: '...' },
    { id: 6, title: 'Оно', author: 'Стивен Кинг', category: 'Фантастика', price: 480, rating: 4.7, cover: '...' },
    { id: 7, title: 'Гарри Поттер и философский камень', author: 'Джоан Роулинг', category: 'Детские', price: 500, rating: 4.9, cover: '...' },
    { id: 8, title: 'Код да Винчи', author: 'Дэн Браун', category: 'История', price: 460, rating: 4.4, cover: '...' },
    { id: 9, title: 'Гордость и предубеждение', author: 'Джейн Остин', category: 'Художественная', price: 380, rating: 4.8, cover: '...' },
    { id: 10, title: 'Краткая история времени', author: 'Стивен Хокинг', category: 'Наука', price: 550, rating: 4.9, cover: '...' },
    { id: 11, title: 'Игра престолов', author: 'Джордж Мартин', category: 'Фантастика', price: 490, rating: 4.7, cover: '...' },
    { id: 12, title: '1984', author: 'Джордж Оруэлл', category: 'Художественная', price: 410, rating: 4.8, cover: '...' },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  const filteredBooks = testBooks.filter(book => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(book.category);
    const authorMatch = selectedAuthors.length === 0 || selectedAuthors.includes(book.author);
    return categoryMatch && authorMatch;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'popularity') return b.rating - a.rating;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleAuthorChange = (author) => {
    setSelectedAuthors(prev => 
      prev.includes(author) 
        ? prev.filter(a => a !== author) 
        : [...prev, author]
    );
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.catalogWrapper}>
      <div className={styles.catalogContainer}>
        
        <div className={styles.catalogContent}>
          <Filters 
            categories={allCategories}
            authors={allAuthors}
            selectedCategories={selectedCategories}
            selectedAuthors={selectedAuthors}
            onCategoryChange={handleCategoryChange}
            onAuthorChange={handleAuthorChange}
          />
          
          <BookList 
            books={currentBooks} 
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CatalogPage;