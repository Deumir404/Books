import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, fetchUserProfile, clearAuthData } from '../../utils/auth';
import styles from './BecomeAuthor.module.css';

const BecomeAuthorPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    text: '',
    idUser: 0,
    roleUser: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Проверяем, подавал ли пользователь уже заявку
  const checkApplicationStatus = async (userId) => {
    try {
      const response = await fetch(`/api/RoleApplication/check?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHasApplied(data.hasApplied);
      }
    } catch (err) {
      console.error('Ошибка проверки заявки:', err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = await fetchUserProfile();
        if (!userData) {
          throw new Error('Не удалось загрузить данные пользователя');
        }

        setUser(userData);
        setFormData(prev => ({
          ...prev,
          idUser: userData.id
        }));

        await checkApplicationStatus(userData.id);
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        clearAuthData();
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Проверка минимальной длины текста (50 символов)
      if (formData.text.length < 50) {
        throw new Error('Заявление должно содержать минимум 50 символов');
      }

      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/RoleApplication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text.includes('Microsoft.EntityFrameworkCore') 
          ? 'Ошибка сервера. Пожалуйста, попробуйте позже.'
          : `Ошибка: ${text.slice(0, 100)}...`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Ошибка ${response.status}`);
      }

      setSuccess(true);
      setHasApplied(true);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div className={styles.loading}>Загрузка данных пользователя...</div>;
  }

  if (hasApplied) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Заявка уже подана</h2>
          <p className={styles.subtitle}>
            Вы уже подали заявку на получение роли автора. Ожидайте решения.
          </p>
          <button 
            className={styles.returnButton}
            onClick={() => navigate('/')}
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Заявка отправлена!</h2>
          <p className={styles.subtitle}>
            Ваша заявка на получение роли автора успешно отправлена.
          </p>
          <button 
            className={styles.returnButton}
            onClick={() => navigate('/')}
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Стать автором</h1>
        <p className={styles.subtitle}>
          Заполните заявление для получения роли автора
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="text" className={styles.label}>
              Ваше заявление (минимум 50 символов)*
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              className={styles.textarea}
              rows={8}
              minLength={50}
              required
              placeholder="Опишите ваш опыт и почему вы хотите стать автором (минимум 50 символов)..."
            />
            <div className={styles.charCount}>
              Символов: {formData.text.length} (минимум 50)
            </div>
          </div>

          <div className={styles.userInfo}>
            <p>Заявка будет отправлена от имени: <strong>{user.username || user.email}</strong></p>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || hasApplied}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeAuthorPage;