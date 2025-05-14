import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles.paginationContainer}>
      <button 
        className={styles.paginationButton}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Назад
      </button>
      
      <span className={styles.pageInfo}>
        Страница {currentPage} из {totalPages}
      </span>
      
      <button 
        className={styles.paginationButton}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Вперед
      </button>
    </div>
  );
};

export default Pagination;