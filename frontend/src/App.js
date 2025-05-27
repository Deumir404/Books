import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import Rules from './pages/Rules/Rules';
import BookPage from './pages/Book/BookPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Profile from './pages/Profile/Profile';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/profile" element={<Profile />} />
            {/* Страница 404 для несуществующих маршрутов */}
            <Route path="*" element={<div>Страница не найдена</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;