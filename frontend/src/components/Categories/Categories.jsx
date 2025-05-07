import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Categories.module.css';

// Импортируем SVG-иконки
import FictionIcon from '../../assets/fiction.svg';
import ScienceIcon from '../../assets/science.svg';
import HistoryIcon from '../../assets/history.svg';
import PsychologyIcon from '../../assets/psychology.svg';
import CookingIcon from '../../assets/cooking.svg';
import ChildrenIcon from '../../assets/children.svg';

const Categories = () => {
  const categories = [
    { name: 'Художественная', icon: FictionIcon, color: '#FF9E9E' },
    { name: 'Наука', icon: ScienceIcon, color: '#9EC5FF' },
    { name: 'История', icon: HistoryIcon, color: '#FFD79E' },
    { name: 'Психология', icon: PsychologyIcon, color: '#C59EFF' },
    { name: 'Кулинария', icon: CookingIcon, color: '#9EFFB5' },
    { name: 'Детские', icon: ChildrenIcon, color: '#FF9EE2' },
  ];

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Популярные категории</h2>
        <Link to="/catalog" className={styles.allCategoriesLink}>
          Все категории →
        </Link>
      </div>
      
      <div className={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <Link 
            to="/catalog" 
            className={styles.categoryCard} 
            key={index}
          >
            <div 
              className={styles.iconCircle} 
              style={{ backgroundColor: category.color }}
            >
              <img src={category.icon} alt={category.name} className={styles.icon} />
            </div>
            <span className={styles.categoryName}>{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;