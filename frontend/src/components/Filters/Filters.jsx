import React, { useState } from 'react';
import styles from './Filters.module.css';

const Filters = ({
  categories,
  authors,
  selectedCategories,
  selectedAuthors,
  onCategoryChange,
  onAuthorChange
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);

  return (
    <div className={styles.filtersContainer}>
      <h3 className={styles.filtersTitle}>Фильтры</h3>
      
      <div className={styles.filterRow}>
        {/* Фильтр по категориям */}
        <div className={styles.filterDropdown}>
          <button 
            className={styles.dropdownButton}
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            Категории: {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Все'}
          </button>
          
          {showCategoryDropdown && (
            <div className={styles.dropdownContent}>
              {categories.map(category => (
                <div 
                  key={category} 
                  className={`${styles.dropdownItem} ${selectedCategories.includes(category) ? styles.selected : ''}`}
                  onClick={() => onCategoryChange(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Фильтр по авторам */}
        <div className={styles.filterDropdown}>
          <button 
            className={styles.dropdownButton}
            onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}
          >
            Авторы: {selectedAuthors.length > 0 ? selectedAuthors.join(', ') : 'Все'}
          </button>
          
          {showAuthorDropdown && (
            <div className={styles.dropdownContent}>
              {authors.map(author => (
                <div 
                  key={author} 
                  className={`${styles.dropdownItem} ${selectedAuthors.includes(author) ? styles.selected : ''}`}
                  onClick={() => onAuthorChange(author)}
                >
                  {author}
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