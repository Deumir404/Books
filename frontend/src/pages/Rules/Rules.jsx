import React from 'react';
import styles from './Rules.css';

const Rules = () => {
  return (
    <div className={styles.rulesContainer}>
      <h1 className={styles.pageTitle}>Правила</h1>
      
      {/* Белый фрейм для читателей */}
      <div className={`${styles.rulesFrame} ${styles.whiteFrame}`}>
        <h2 className={styles.sectionTitle}>Правила для читателей</h2>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Уважительные комментарии</h3>
          <p className={styles.ruleText}>
            Все комментарии должны быть вежливыми и конструктивными. Критика допустима, но только в корректной форме.
          </p>
        </div>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Запрет на оскорбления</h3>
          <p className={styles.ruleText}>
            Запрещены любые формы оскорблений, дискриминации, расизма, сексизма и других видов нетерпимости.
          </p>
        </div>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Конструктивная критика</h3>
          <p className={styles.ruleText}>
            При оценке книг аргументируйте свое мнение. Фразы типа "это плохо" без объяснения причин не допускаются.
          </p>
        </div>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Спам и реклама</h3>
          <p className={styles.ruleText}>
            Запрещена публикация рекламных сообщений, ссылок на сторонние ресурсы и спама.
          </p>
        </div>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Конфиденциальность</h3>
          <p className={styles.ruleText}>
            Не публикуйте личную информацию других пользователей без их согласия.
          </p>
        </div>
      </div>
      
      {/* Голубой фрейм для авторов */}
      <div className={`${styles.rulesFrame} ${styles.blueFrame}`}>
        <h2 className={styles.sectionTitle}>Правила для авторов</h2>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Оригинальный контент</h3>
          <p className={styles.ruleText}>
            Размещайте только авторские произведения. Плагиат и нарушение авторских прав строго запрещены.
          </p>
        </div>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Возрастные ограничения</h3>
          <p className={styles.ruleText}>
            Помечайте контент соответствующими возрастными ограничениями, если он содержит материалы 18+.
          </p>
        </div>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Запрещенный контент</h3>
          <p className={styles.ruleText}>
            Запрещены материалы, пропагандирующие насилие, экстремизм, расовую или религиозную нетерпимость.
          </p>
        </div>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Категоризация</h3>
          <p className={styles.ruleText}>
            Правильно указывайте жанр и категорию произведения для удобства читателей.
          </p>
        </div>
        
        <div className={styles.ruleCard}>
          <h3 className={styles.ruleTitle}>Ответ на отзывы</h3>
          <p className={styles.ruleText}>
            Авторам рекомендуется вежливо отвечать на отзывы читателей, поддерживая диалог.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rules;