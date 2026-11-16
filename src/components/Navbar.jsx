import { NavLink, Link } from 'react-router-dom';
import Icon from './Icon.jsx';

const links = [
  { to: '/', label: 'StreamList', icon: 'playlist_add' },
  { to: '/movies', label: 'Movies', icon: 'movie' },
  { to: '/cart', label: 'Cart', icon: 'shopping_cart' },
  { to: '/about', label: 'About', icon: 'info' },
];

// toWatchCount comes from App and shows how many titles are still unwatched.
function Navbar({ toWatchCount }) {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-logo">
          <Icon name="play_arrow" />
        </span>
        <span className="brand-text">
          Stream<span className="brand-accent">List</span>
        </span>
      </Link>

      <nav aria-label="Main navigation">
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                aria-label={link.label}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <Icon name={link.icon} />
                <span className="nav-label">{link.label}</span>
                {link.to === '/' && toWatchCount > 0 && (
                  <span className="nav-badge" aria-label={`${toWatchCount} to watch`}>
                    {toWatchCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
