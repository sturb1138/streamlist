import { NavLink, Link } from 'react-router-dom';
import Icon from './Icon.jsx';

const links = [
  { to: '/', label: 'StreamList', icon: 'playlist_add' },
  { to: '/movies', label: 'Movies', icon: 'movie' },
  { to: '/subscriptions', label: 'Subscriptions', icon: 'subscriptions' },
  { to: '/cart', label: 'Cart', icon: 'shopping_cart' },
  { to: '/about', label: 'About', icon: 'info' },
];

// toWatchCount and cartCount come from App.
// toWatchCount = titles still unwatched, cartCount = items in the cart.
function Navbar({ toWatchCount, cartCount }) {
  const badges = {
    '/': { count: toWatchCount, label: 'to watch' },
    '/cart': { count: cartCount, label: 'in cart' },
  };

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
                {badges[link.to]?.count > 0 && (
                  <span className="nav-badge" aria-label={`${badges[link.to].count} ${badges[link.to].label}`}>
                    {badges[link.to].count}
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
