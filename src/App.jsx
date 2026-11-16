import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import StreamList from './pages/StreamList.jsx';
import Movies from './pages/Movies.jsx';
import Cart from './pages/Cart.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

const YEAR = new Date().getFullYear();
const STORAGE_KEY = 'streamlist-items';

function loadItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return []; 
  }
}

function App() {
  const [items, setItems] = useState(loadItems);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
    }
  }, [items]);

  const toWatchCount = items.filter((item) => !item.completed).length;

  return (
    <div className="app">
      <Navbar toWatchCount={toWatchCount} />
      <main className="content">
        <Routes>
          <Route path="/" element={<StreamList items={items} setItems={setItems} />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        &copy; {YEAR} EZTechMovie &middot; StreamList
      </footer>
    </div>
  );
}

export default App;
