// src/pages/Profile/Profile.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAuthToken, 
  clearAuthData, 
  getUserData,
  fetchUserProfile,
  saveAuthData
} from '../../utils/auth';
import styles from './Profile.module.css';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordChange, setPasswordChange] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          navigate('/login');
          return;
        }

        // Проверяем есть ли данные в localStorage
        const localUserData = getUserData();
        if (localUserData) {
          setProfileData(localUserData);
        }

        // Загружаем свежие данные с сервера
        const serverData = await fetchUserProfile();
        setProfileData(serverData || localUserData);
        
      } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
        setError('Не удалось загрузить данные профиля');
        if (err.response?.status === 401) {
          clearAuthData();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordChange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const token = getAuthToken();
      const userData = getUserData();
      
      if (!token || !userData?.id) {
        navigate('/login');
        return;
      }

      // 1. Проверяем старый пароль через эндпоинт входа
      try {
        await axios.post('/Users/login', {
          email: profileData.email,
          password: passwordChange.oldPassword
        });
      } catch (err) {
        throw new Error('Неверный текущий пароль');
      }

      // 2. Отправляем новый пароль
      const response = await axios.put(`/Users/${userData.id}`, {
        username: profileData.username,
        email: profileData.email,
        password: passwordChange.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 3. Обновляем данные пользователя
      const updatedUserData = {
        ...userData,
        ...response.data
      };
      saveAuthData(token, updatedUserData);
      setProfileData(updatedUserData);

      setPasswordSuccess('Пароль успешно изменен');
      setPasswordChange({
        oldPassword: '',
        newPassword: ''
      });
    } catch (err) {
      console.error('Ошибка при смене пароля:', err);
      setPasswordError(err.message || 'Не удалось изменить пароль');
    }
  };

  if (isLoading) {
    return <div className={styles.profileContainer}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.profileContainer}>{error}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h1>Профиль пользователя</h1>
      
      {profileData && (
        <div className={styles.profileInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Имя пользователя:</span>
            <span className={styles.infoValue}>{profileData.username}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email:</span>
            <span className={styles.infoValue}>{profileData.email}</span>
          </div>
        </div>
      )}

      <div className={styles.passwordChangeSection}>
        <h2>Смена пароля</h2>
        <form onSubmit={handleSubmitPasswordChange}>
          <div className={styles.formGroup}>
            <label htmlFor="oldPassword">Текущий пароль:</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={passwordChange.oldPassword}
              onChange={handlePasswordChange}
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">Новый пароль:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordChange.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
              className={styles.formInput}
            />
          </div>
          
          {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
          {passwordSuccess && <div className={styles.successMessage}>{passwordSuccess}</div>}
          
          <button type="submit" className={styles.submitButton}>
            Изменить пароль
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;