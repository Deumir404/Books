import React, { useState } from 'react';
import styles from './Filters.module.css';

const Filters = ({
  authors = [],
  categories = [],
  selectedAuthors = [],
  selectedCategories = [],
  onAuthorChange,
  onCategoryChange,
}) => {
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleAuthorClick = (authorId) => {
    onAuthorChange(authorId);
    setShowAuthorDropdown(false);
  };

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId);
    setShowCategoryDropdown(false);
  };

  const getSelectedNames = (ids, items, idKey = 'id', nameKey = 'name') => {
    if (!ids.length) return 'Все';
    return ids
      .map(id => items.find(item => item[idKey] === id)?.[nameKey])
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className={styles.filtersContainer}>
      <h2 className={styles.filtersTitle}>Фильтры</h2>
      <div className={styles.filterRow}>
        {/* Фильтр по авторам */}
        <div className={styles.filterDropdown}>
          <button 
            className={styles.dropdownButton}
            onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}
            onBlur={() => setTimeout(() => setShowAuthorDropdown(false), 200)}
          >
            Авторы: {getSelectedNames(selectedAuthors, authors, 'id', 'nickname')}
          </button>
          
          {showAuthorDropdown && (
            <div className={styles.dropdownContent}>
              {authors.map(author => (
                <div 
                  key={author.id}
                  className={`${styles.dropdownItem} ${
                    selectedAuthors.includes(author.id) ? styles.selected : ''
                  }`}
                  onClick={() => handleAuthorClick(author.id)}
                >
                  {author.nickname}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Фильтр по категориям */}
        <div className={styles.filterDropdown}>
          <button 
            className={styles.dropdownButton}
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
          >
            Категории: {getSelectedNames(selectedCategories, categories, 'id', 'name')}
          </button>
          
          {showCategoryDropdown && (
            <div className={styles.dropdownContent}>
              {categories.map(category => (
                <div 
                  key={category.id}
                  className={`${styles.dropdownItem} ${
                    selectedCategories.includes(category.id) ? styles.selected : ''
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;