import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import StreamList from './pages/StreamList.jsx';
import Movies from './pages/Movies.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Cart from './pages/Cart.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import useLocalStorage from './hooks/useLocalStorage.js';

const YEAR = new Date().getFullYear();

function App() {
  // The watch list lives here so every page (and the Navbar badge) can use it.
  // useLocalStorage saves it in the browser, so it survives a page refresh.
  const [items, setItems] = useLocalStorage('streamlist-items', []);

  const toWatchCount = items.filter((item) => !item.completed).length;

  return (
    <div className="app">
      <Navbar toWatchCount={toWatchCount} />
      <main className="content">
        <Routes>
          <Route path="/" element={<StreamList items={items} setItems={setItems} />} />
          <Route path="/movies" element={<Movies items={items} setItems={setItems} />} />
          <Route path="/movies/:id" element={<MovieDetails items={items} setItems={setItems} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        &copy; {YEAR} EZTechMovie &middot; StreamList
        <span className="footer-credit">
          Movie data from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </footer>
    </div>
  );
}

export default App;
