import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import Rules from './pages/Rules/Rules';
import BookPage from './pages/Book/BookPage';
import AdminBooksPage from './pages/Admin/AdminBooksPage';
import AdminAuthorsPage from './pages/Admin/AdminAuthorsPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminAppPage from './pages/Admin/AdminAppPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Profile from './pages/Profile/Profile';
import AuthorPanel from './pages/Authors/AuthorPanel';
import BecomeAuthor from './pages/Authors/BecomeAuthor';
import { getAuthToken, getUserRole } from './utils/auth'; // Предполагается, что у вас есть эти функции
import './App.css';

// Компонент для защиты маршрутов
const RequireAuth = ({ children, role }) => {
  const token = getAuthToken();
  const userRole = getUserRole(); // Получаем роль пользователя

    console.log('Текущий пользователь:', {
    role: userRole,
  });
  
  if (!token) {
    // Если нет токена, перенаправляем на страницу входа
    return <Navigate to="/login" replace />;
  }
  
  if (role && userRole !== role) {
    // Если требуется определенная роль и у пользователя она не совпадает
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/admin/books" 
              element={
                <RequireAuth role={2}>
                  <AdminBooksPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/authors" 
              element={
                <RequireAuth role={2}>
                  <AdminAuthorsPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/requests" 
              element={
                <RequireAuth role={2}>
                  <AdminAppPage />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/user" 
              element={
                <RequireAuth role={2}>
                  <AdminUsersPage />
                </RequireAuth>
              } 
            />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/become-author" element={<BecomeAuthor />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/author-panel" element={<AuthorPanel />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/rules" element={<Rules />} />
            <Route 
              path="/profile" 
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              } 
            />
            {/* Страница 404 для несуществующих маршрутов */}
            <Route path="*" element={<div>Страница не найдена</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;