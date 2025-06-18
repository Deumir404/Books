import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../../utils/auth';
import styles from './AdminUsers.module.css';

const UserForm = ({ 
  user = null, 
  onSubmit, 
  onCancel,
  onMakeAdmin 
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '' // Пароль не предзаполняем
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.adminForm}>
      <h3 className={styles.adminFormTitle}>
        {user ? 'Редактировать пользователя' : 'Добавить пользователя'}
      </h3>
      
      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>Имя пользователя</label>
        <input
          type="text"
          name="username"
          className={styles.adminInput}
          value={formData.username}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>Email</label>
        <input
          type="email"
          name="email"
          className={styles.adminInput}
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>
          {user ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль'}
        </label>
        <input
          type="password"
          name="password"
          className={styles.adminInput}
          value={formData.password}
          onChange={handleInputChange}
          required={!user}
        />
      </div>

      <div className={styles.adminFormActions}>
        {onCancel && (
          <button 
            type="button"
            className={styles.adminSecondaryBtn}
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
        {user && user.role !== 2 && (
          <button 
            type="button"
            className={styles.adminSuccessBtn}
            onClick={onMakeAdmin}
          >
            Назначить администратором
          </button>
        )}
        <button 
          type="submit"
          className={styles.adminPrimaryBtn}
        >
          {user ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Users', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки пользователей');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/Users/${id}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных пользователя');
      }
      
      const data = await response.json();
      setSelectedUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      setIsLoading(true);
      const userData = {
        ...formData,
        role: 0 // По умолчанию обычный пользователь
      };
      
      const response = await fetch('/api/Users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания пользователя');
      }
      
      await fetchUsers();
      setShowUserForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (formData) => {
    try {
      if (!selectedUser) return;
      setIsLoading(true);
      
      const userData = {
        ...formData,
        role: selectedUser.role // Сохраняем текущую роль
      };
      
      const response = await fetch(`/api/Users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления пользователя');
      }
      
      await fetchUsers();
      setSelectedUser(null);
      setShowUserForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const makeAdmin = async () => {
    try {
      if (!selectedUser) return;
      setIsLoading(true);
      
      const adminData = {
        username: selectedUser.username,
        email: selectedUser.email,
        password: '', // Пароль не меняем
        role: 2 // Роль администратора
      };
      
      const response = await fetch(`/api/Users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(adminData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка назначения администратора');
      }
      
      await fetchUsers();
      setSelectedUser(null);
      setShowUserForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/Users/${userToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка удаления пользователя');
      }

      await fetchUsers();
      if (selectedUser?.id === userToDelete) {
        setSelectedUser(null);
      }
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 2: return 'Администратор';
      case 1: return 'Автор';
      default: return 'Пользователь';
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Управление пользователями</h1>
      
      {error && <div className={styles.adminError}>{error}</div>}
      {isLoading && <div className={styles.adminLoading}>Загрузка...</div>}

      <div className={styles.adminContent}>
        <div className={styles.adminPanelHeader}>
          <h2 className={styles.adminPanelTitle}>Пользователи</h2>
          <button 
            className={styles.adminPrimaryBtn}
            onClick={() => {
              setSelectedUser(null);
              setShowUserForm(true);
            }}
          >
            Добавить пользователя
          </button>
        </div>

        {showUserForm ? (
          <UserForm
            user={selectedUser}
            onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
            onCancel={() => {
              setSelectedUser(null);
              setShowUserForm(false);
            }}
            onMakeAdmin={makeAdmin}
          />
        ) : (
          <>
            {users.length === 0 ? (
              <div className={styles.adminEmptyState}>
                <div className={styles.adminEmptyIcon}>👥</div>
                <p>Нет зарегистрированных пользователей</p>
              </div>
            ) : (
              <ul className={styles.adminList}>
                {users.map(user => (
                  <li 
                    key={user.id} 
                    className={`${styles.adminListItem} ${
                      selectedUser?.id === user.id ? styles.adminSelectedItem : ''
                    }`}
                    onClick={() => {
                      fetchUserDetails(user.id);
                      setShowUserForm(false);
                    }}
                  >
                    <div>
                      <strong>{user.username}</strong>
                      <div className={styles.adminDetails}>
                        {user.email}
                      </div>
                      <div className={styles.adminMeta}>
                        <span>Роль: {getRoleName(user.role)}</span>
                      </div>
                    </div>
                    <div className={styles.adminActionButtons}>
                      <button 
                        className={styles.adminSecondaryBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchUserDetails(user.id);
                          setShowUserForm(true);
                        }}
                      >
                        Редактировать
                      </button>
                      <button 
                        className={styles.adminDeleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(user.id);
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <div className={styles.adminModalOverlay}>
          <div className={styles.adminModalContent}>
            <h3 className={styles.adminModalTitle}>Подтверждение удаления</h3>
            <p className={styles.adminModalText}>
              Вы уверены, что хотите удалить этого пользователя?
            </p>
            <div className={styles.adminModalActions}>
              <button 
                className={styles.adminSecondaryBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Отмена
              </button>
              <button 
                className={styles.adminDeleteBtn}
                onClick={executeDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;