import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import StreamList from './pages/StreamList.jsx';
import Movies from './pages/Movies.jsx';
import Cart from './pages/Cart.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

const YEAR = new Date().getFullYear();

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<StreamList />} />
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
