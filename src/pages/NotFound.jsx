import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

function NotFound() {
  return (
    <section className="page">
      <h1 className="page-title">
        <Icon name="error" className="title-icon" />
        Page not found
      </h1>
      <Link to="/" className="btn-primary inline">
        <Icon name="home" /> Back to StreamList
      </Link>
    </section>
  );
}

export default NotFound;
