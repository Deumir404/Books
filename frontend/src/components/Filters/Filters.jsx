import React, { useState } from 'react';
import styles from './Filters.module.css';

const Filters = ({
  authors,
  categories,
  selectedAuthors,
  selectedCategories,
  onAuthorChange,
  onCategoryChange
}) => {
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterRow}>
        {/* Фильтр по авторам */}
        <div className={styles.filterDropdown}>
          <button 
            className={styles.dropdownButton}
            onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}
          >
            Авторы: {selectedAuthors.length > 0 
              ? selectedAuthors.map(id => 
                  authors.find(a => a.id === id)?.nickname).join(', ') 
              : 'Все'}
          </button>
          
          {showAuthorDropdown && (
            <div className={styles.dropdownContent}>
              {authors.map(author => (
                <div 
                  key={author.id}
                  className={`${styles.dropdownItem} ${
                    selectedAuthors.includes(author.id) ? styles.selected : ''
                  }`}
                  onClick={() => onAuthorChange(author.id)}
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
          >
            Категории: {selectedCategories.length > 0 
              ? selectedCategories.map(id => 
                  categories.find(c => c.idCategory === id)?.name).join(', ') 
              : 'Все'}
          </button>
          
          {showCategoryDropdown && (
            <div className={styles.dropdownContent}>
              {categories.map(category => (
                <div 
                  key={category.idCategory}
                  className={`${styles.dropdownItem} ${
                    selectedCategories.includes(category.idCategory) ? styles.selected : ''
                  }`}
                  onClick={() => onCategoryChange(category.idCategory)}
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