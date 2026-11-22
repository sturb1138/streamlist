import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { posterUrl } from '../api/tmdb.js';

// One search result. Clicking the poster or title opens the details page.
function MovieCard({ movie, onList, onAdd }) {
  const poster = posterUrl(movie.posterPath);

  return (
    <li className="movie-card">
      <Link to={`/movies/${movie.id}`} className="movie-poster" aria-label={`View details for ${movie.title}`}>
        {poster ? (
          <img src={poster} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <span className="poster-missing">
            <Icon name="image_not_supported" />
          </span>
        )}
        {movie.rating > 0 && (
          <span className="movie-rating">
            <Icon name="star" /> {movie.rating.toFixed(1)}
          </span>
        )}
      </Link>

      <div className="movie-info">
        <Link to={`/movies/${movie.id}`} className="movie-title">
          {movie.title}
        </Link>
        <span className="item-meta">{movie.year || 'Year unknown'}</span>
      </div>

      <button
        type="button"
        className={onList ? 'btn-add added' : 'btn-add'}
        onClick={() => onAdd(movie)}
        disabled={onList}
      >
        <Icon name={onList ? 'check' : 'playlist_add'} />
        {onList ? 'On your list' : 'Add to list'}
      </button>
    </li>
  );
}

export default MovieCard;
