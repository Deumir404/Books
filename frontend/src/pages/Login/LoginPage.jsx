import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { saveAuthData, parseJwtPayload } from '../../utils/auth';
import styles from './AuthPages.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Отправка данных для авторизации
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        try {
          responseData = text ? JSON.parse(text) : {};
        } catch {
          responseData = { token: text };
        }
      }

      if (!response.ok) {
        throw new Error(
          responseData.message || 
          responseData.error || 
          `Ошибка ${response.status}: ${response.statusText}`
        );
      }

      const token = responseData.token || responseData.access_token || responseData.jwt;
      if (!token || typeof token !== 'string') {
        throw new Error('Сервер не вернул токен авторизации');
      }

      // 2. Получение данных пользователя
      let userData = responseData.user || parseJwtPayload(token) || {};
      
      // 3. Запрос к защищенному эндпоинту для получения полных данных (включая роль)
      try {
        const profileResponse = await fetch('/Users/MyProfile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!profileResponse.ok) {
          throw new Error(`Ошибка получения профиля: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        if (profileData) {
          userData = { 
            ...userData, 
            ...profileData,
            role: profileData.role // Явно берем роль из ответа сервера
          };
        }
      } catch (profileError) {
        console.error('Ошибка получения профиля:', profileError);
        // Продолжаем без данных профиля, если запрос не удался
      }

      // 4. Сохранение данных
      saveAuthData(token, userData);

      // 5. Перенаправление в зависимости от роли
      const redirectTo = location.state?.from?.pathname || (userData.role === 2 ? '/admin/books' : '/');
      navigate(redirectTo, { replace: true });

      // 6. Обновление страницы для применения изменений
      window.location.reload();
    } catch (error) {
      setError(error.message || 'Произошла ошибка при входе');
      console.error('Ошибка входа:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Авторизация</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className={styles.submitButton}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;