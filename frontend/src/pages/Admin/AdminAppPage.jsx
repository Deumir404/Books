import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../../utils/auth';
import styles from './AdminApp.module.css';

const RoleApplicationForm = ({ 
  application = null, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    text: '',
    idUser: 0,
    roleUser: 0
  });

  useEffect(() => {
    if (application) {
      setFormData({
        text: application.text || '',
        idUser: application.user?.id || 0,
        roleUser: application.roleUser || 0
      });
    }
  }, [application]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'idUser' || name === 'roleUser' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.adminForm}>
      <h3 className={styles.adminFormTitle}>
        {application ? 'Редактировать заявку' : 'Создать заявку'}
      </h3>
      
      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>Текст заявки</label>
        <textarea
          name="text"
          className={styles.adminTextarea}
          value={formData.text}
          onChange={handleInputChange}
          rows={4}
          required
        />
      </div>

      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>ID пользователя</label>
        <input
          type="number"
          name="idUser"
          className={styles.adminInput}
          value={formData.idUser}
          onChange={handleInputChange}
          min="0"
          required
        />
      </div>

      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>Роль</label>
        <select
          name="roleUser"
          className={styles.adminSelect}
          value={formData.roleUser}
          onChange={handleInputChange}
          required
        >
          <option value="0">Пользователь</option>
          <option value="1">Автор</option>
        </select>
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
        <button 
          type="submit"
          className={styles.adminPrimaryBtn}
        >
          {application ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
};

const ComplaintForm = ({ 
  complaint = null, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    text: '',
    idComment: 0,
    idUser: 0,
    status: 0
  });

  useEffect(() => {
    if (complaint) {
      setFormData({
        text: complaint.text || '',
        idComment: complaint.comment?.id || 0,
        idUser: complaint.user?.id || 0,
        status: complaint.status || 0
      });
    }
  }, [complaint]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'idComment' || name === 'idUser' || name === 'status' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.adminForm}>
      <h3 className={styles.adminFormTitle}>
        {complaint ? 'Редактировать жалобу' : 'Создать жалобу'}
      </h3>
      
      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>Текст жалобы</label>
        <textarea
          name="text"
          className={styles.adminTextarea}
          value={formData.text}
          onChange={handleInputChange}
          rows={4}
          required
        />
      </div>

      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>ID комментария</label>
        <input
          type="number"
          name="idComment"
          className={styles.adminInput}
          value={formData.idComment}
          onChange={handleInputChange}
          min="0"
          required
        />
      </div>

      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>ID пользователя</label>
        <input
          type="number"
          name="idUser"
          className={styles.adminInput}
          value={formData.idUser}
          onChange={handleInputChange}
          min="0"
          required
        />
      </div>

      <div className={styles.adminFormGroup}>
        <label className={styles.adminLabel}>Статус</label>
        <select
          name="status"
          className={styles.adminSelect}
          value={formData.status}
          onChange={handleInputChange}
          required
        >
          <option value="0">Новая</option>
          <option value="1">В обработке</option>
          <option value="2">Решена</option>
          <option value="3">Отклонена</option>
        </select>
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
        <button 
          type="submit"
          className={styles.adminPrimaryBtn}
        >
          {complaint ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
};

const AdminApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    } else {
      fetchComplaints();
    }
  }, [activeTab]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/RoleApplication', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки заявок');
      }
      
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Complaint', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки жалоб');
      }
      
      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleCreateApplication = async (formData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/RoleApplication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания заявки');
      }
      
      await fetchApplications();
      setShowApplicationForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateApplication = async (formData) => {
    try {
      if (!selectedApplication) return;
      setIsLoading(true);
      
      const response = await fetch(`/api/RoleApplication/${selectedApplication.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления заявки');
      }
      
      await fetchApplications();
      setSelectedApplication(null);
      setShowApplicationForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateComplaint = async (formData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/Complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка создания жалобы');
      }
      
      await fetchComplaints();
      setShowComplaintForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComplaint = async (formData) => {
    try {
      if (!selectedComplaint) return;
      setIsLoading(true);
      
      const response = await fetch(`/api/Complaint/${selectedComplaint.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления жалобы');
      }
      
      await fetchComplaints();
      setSelectedComplaint(null);
      setShowComplaintForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const approveAuthorRole = async (applicationId) => {
    try {
      setIsLoading(true);
      const application = applications.find(app => app.id === applicationId);
      if (!application || !application.user) return;

      // Получаем текущие данные пользователя
      const userResponse = await fetch(`/api/Users/${application.user.id}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (!userResponse.ok) {
        throw new Error('Ошибка получения данных пользователя');
      }

      const userData = await userResponse.json();

      // Обновляем только роль, сохраняя остальные данные
      const updatedUser = {
        username: userData.username,
        email: userData.email,
        password: '', // Пароль не меняем
        role: 1 // Устанавливаем роль "Автор"
      };

      // Отправляем обновленные данные пользователя
      const updateResponse = await fetch(`/api/Users/${application.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(updatedUser)
      });

      if (!updateResponse.ok) {
        throw new Error('Ошибка обновления роли пользователя');
      }

      // Удаляем заявку после успешного обновления роли
      const deleteResponse = await fetch(`/api/RoleApplication/${applicationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (!deleteResponse.ok) {
        throw new Error('Ошибка удаления заявки');
      }

      await fetchApplications();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    try {
      setIsLoading(true);
      const { type, id } = itemToDelete;
      
      const endpoint = type === 'application' 
        ? `/api/RoleApplication/${id}`
        : `/api/Complaint/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Ошибка удаления ${type === 'application' ? 'заявки' : 'жалобы'}`);
      }

      if (type === 'application') {
        await fetchApplications();
        if (selectedApplication?.id === id) {
          setSelectedApplication(null);
        }
      } else {
        await fetchComplaints();
        if (selectedComplaint?.id === id) {
          setSelectedComplaint(null);
        }
      }

      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getRoleName = (role) => {
    return role === 1 ? 'Автор' : 'Пользователь';
  };

  const getStatusName = (status) => {
    switch (status) {
      case 1: return 'В обработке';
      case 2: return 'Решена';
      case 3: return 'Отклонена';
      default: return 'Новая';
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* <h1 className={styles.adminTitle}>Управление заявками и жалобами</h1> */}
      
      {error && <div className={styles.adminError}>{error}</div>}
      {isLoading && <div className={styles.adminLoading}>Загрузка...</div>}

      <div className={styles.adminTabs}>
        <button
          className={`${styles.adminTab} ${activeTab === 'applications' ? styles.adminActiveTab : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Заявки на роль автора
        </button>
        <button
          className={`${styles.adminTab} ${activeTab === 'complaints' ? styles.adminActiveTab : ''}`}
          onClick={() => setActiveTab('complaints')}
        >
          Жалобы на отзывы
        </button>
      </div>

      <div className={styles.adminContent}>
        {activeTab === 'applications' ? (
          <>
            <div className={styles.adminPanelHeader}>
              <h2 className={styles.adminPanelTitle}>Заявки на роль автора</h2>
              <button 
                className={styles.adminPrimaryBtn}
                onClick={() => {
                  setSelectedApplication(null);
                  setShowApplicationForm(true);
                }}
              >
                Создать заявку
              </button>
            </div>

            {showApplicationForm ? (
              <RoleApplicationForm
                application={selectedApplication}
                onSubmit={selectedApplication ? handleUpdateApplication : handleCreateApplication}
                onCancel={() => {
                  setSelectedApplication(null);
                  setShowApplicationForm(false);
                }}
              />
            ) : (
              <>
                {applications.length === 0 ? (
                  <div className={styles.adminEmptyState}>
                    <div className={styles.adminEmptyIcon}>📝</div>
                    <p>Нет доступных заявок</p>
                  </div>
                ) : (
                  <ul className={styles.adminList}>
                    {applications.map(application => (
                      <li 
                        key={application.id} 
                        className={`${styles.adminListItem} ${
                          selectedApplication?.id === application.id ? styles.adminSelectedItem : ''
                        }`}
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowApplicationForm(false);
                        }}
                      >
                        <div>
                          <strong>{application.user?.username || 'Неизвестный пользователь'}</strong>
                          <div className={styles.adminDetails}>
                            {application.text}
                          </div>
                          <div className={styles.adminMeta}>
                            <span>Роль: {getRoleName(application.roleUser)}</span>
                            <span>Дата: {formatDate(application.publishedDate)}</span>
                          </div>
                        </div>
                        <div className={styles.adminActionButtons}>
                          {application.roleUser === 1 && (
                            <button 
                              className={styles.adminSuccessBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                approveAuthorRole(application.id);
                              }}
                            >
                              Одобрить
                            </button>
                          )}
                          <button 
                            className={styles.adminSecondaryBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApplication(application);
                              setShowApplicationForm(true);
                            }}
                          >
                            Редактировать
                          </button>
                          <button 
                            className={styles.adminDeleteBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete('application', application.id);
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
          </>
        ) : (
          <>
            <div className={styles.adminPanelHeader}>
              <h2 className={styles.adminPanelTitle}>Жалобы на отзывы</h2>
              <button 
                className={styles.adminPrimaryBtn}
                onClick={() => {
                  setSelectedComplaint(null);
                  setShowComplaintForm(true);
                }}
              >
                Создать жалобу
              </button>
            </div>

            {showComplaintForm ? (
              <ComplaintForm
                complaint={selectedComplaint}
                onSubmit={selectedComplaint ? handleUpdateComplaint : handleCreateComplaint}
                onCancel={() => {
                  setSelectedComplaint(null);
                  setShowComplaintForm(false);
                }}
              />
            ) : (
              <>
                {complaints.length === 0 ? (
                  <div className={styles.adminEmptyState}>
                    <div className={styles.adminEmptyIcon}>⚠️</div>
                    <p>Нет доступных жалоб</p>
                  </div>
                ) : (
                  <ul className={styles.adminList}>
                    {complaints.map(complaint => (
                      <li 
                        key={complaint.id} 
                        className={`${styles.adminListItem} ${
                          selectedComplaint?.id === complaint.id ? styles.adminSelectedItem : ''
                        }`}
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowComplaintForm(false);
                        }}
                      >
                        <div>
                          <strong>Жалоба от: {complaint.user?.username || 'Неизвестный пользователь'}</strong>
                          <div className={styles.adminDetails}>
                            {complaint.text}
                          </div>
                          <div className={styles.adminMeta}>
                            <span>Статус: {getStatusName(complaint.status)}</span>
                            <span>Дата: {formatDate(complaint.publishedDate)}</span>
                          </div>
                          {complaint.comment && (
                            <div className={styles.adminComment}>
                              <strong>Комментарий:</strong>
                              <p>{complaint.comment.text}</p>
                              <div className={styles.adminCommentMeta}>
                                <span>Книга ID: {complaint.comment.bookId}</span>
                                <span>Автор: {complaint.comment.user?.username}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={styles.adminActionButtons}>
                          <button 
                            className={styles.adminSecondaryBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComplaint(complaint);
                              setShowComplaintForm(true);
                            }}
                          >
                            Редактировать
                          </button>
                          <button 
                            className={styles.adminDeleteBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete('complaint', complaint.id);
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
          </>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <div className={styles.adminModalOverlay}>
          <div className={styles.adminModalContent}>
            <h3 className={styles.adminModalTitle}>Подтверждение удаления</h3>
            <p className={styles.adminModalText}>
              Вы уверены, что хотите удалить {itemToDelete.type === 'application' ? 'эту заявку' : 'эту жалобу'}?
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

export default AdminApplicationsPage;