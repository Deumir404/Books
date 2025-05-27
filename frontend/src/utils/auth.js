// Сохранение данных авторизации
export const saveAuthData = (token, userData) => {
  try {
    if (typeof token !== 'string') {
      throw new Error('Токен должен быть строкой');
    }
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    window.dispatchEvent(new Event('authChange'));
  } catch (error) {
    console.error('Ошибка сохранения данных авторизации:', error);
    throw error;
  }
};

// Очистка данных авторизации
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('authChange'));
};

// Получение токена
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Получение данных пользователя
export const getUserData = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Ошибка парсинга user данных:', error);
    clearAuthData();
    return null;
  }
};

// Проверка авторизации
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Получение имени пользователя
export const getUsername = () => {
  const user = getUserData();
  return user?.username || user?.email || '';
};

// Декодирование JWT токена
export const parseJwtPayload = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Ошибка декодирования JWT:', error);
    return null;
  }
};

// Обновление данных пользователя с сервера
export const fetchUserProfile = async () => {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch('/Users/MyProfile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/plain, application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}`);
    }

    let userData;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      userData = await response.json();
    } else {
      const text = await response.text();
      try {
        userData = text ? JSON.parse(text) : {};
      } catch {
        userData = { username: text };
      }
    }

    console.log('Данные пользователя с сервера:', userData);
    
    // Обновляем данные в localStorage
    const currentUser = getUserData() || {};
    saveAuthData(token, { ...currentUser, ...userData });
    
    return userData;
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    return null;
  }
};