import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Authors from './pages/Authors/Authors';
import Rules from './pages/Rules/Rules';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/rules" element={<Rules />} />
            {/* Страница 404 для несуществующих маршрутов */}
            <Route path="*" element={<div>Страница не найдена</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;