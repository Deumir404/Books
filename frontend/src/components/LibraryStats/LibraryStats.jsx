import React from 'react';
import styles from './LibraryStats.module.css';

import BooksIcon from '../../assets/books.svg';
import ReadersIcon from '../../assets/readers.svg';
import AuthorsIcon from '../../assets/authors.svg';
import DownloadsIcon from '../../assets/downloads.svg';

const LibraryStats = () => {
  const stats = [
    { value: '10,000+', label: 'Книг в библиотеке', icon: BooksIcon, color: '#FF9E9E' },
    { value: '5,000+', label: 'Активных читателей', icon: ReadersIcon, color: '#9EC5FF' },
    { value: '2,500+', label: 'Авторов', icon: AuthorsIcon, color: '#FFD79E' },
    { value: '1M+', label: 'Загрузок книг', icon: DownloadsIcon, color: '#C59EFF' }
  ];

  return (
    <div className={styles.statsContainer} style={{ backgroundColor: '#510EE1' }}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div className={styles.statCard} key={index}>
            <div 
              className={styles.iconCircle} 
              style={{ backgroundColor: stat.color }}
            >
              <img 
                src={stat.icon} 
                alt={stat.label} 
                className={styles.icon} 
                style={{ filter: 'brightness(0) invert(1)' }} 
              />
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryStats;