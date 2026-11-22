import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { getMovieDetails, posterUrl } from '../api/tmdb.js';
import { isOnList, makeItem, movieTitle } from '../utils/watchList.js';

// Show runtime as "2h 28m".
function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

// Details page for one movie, at the address /movies/:id.
function MovieDetails({ items, setItems }) {
  const { id } = useParams(); // the movie id from the web address
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [, setRecent] = useLocalStorage('streamlist-recently-viewed', []);

  useEffect(() => {
    let ignore = false; // stops an old request from overwriting a newer one
    setMovie(null);
    setError('');

    getMovieDetails(id)
      .then((data) => {
        if (ignore) return;
        setMovie(data);
        // Remember this movie in "Recently viewed" (newest first, max 8).
        const summary = {
          id: data.id,
          title: data.title,
          year: data.release_date ? data.release_date.slice(0, 4) : '',
          posterPath: data.poster_path,
        };
        setRecent((old) => [summary, ...old.filter((m) => m.id !== data.id)].slice(0, 8));
      })
      .catch((err) => !ignore && setError(err.message));

    return () => {
      ignore = true;
    };
  }, [id, setRecent]);

  const backLink = (
    <Link to="/movies" className="btn-text no-margin back-link">
      <Icon name="arrow_back" /> Back to search
    </Link>
  );

  if (error) {
    return (
      <section className="page">
        {backLink}
        <p className="form-message" role="alert">
          <Icon name="error" /> {error}
        </p>
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="page">
        {backLink}
        <p className="loading">
          <Icon name="hourglass_top" /> Loading movie details...
        </p>
      </section>
    );
  }

  const title = movieTitle(movie);
  const onList = isOnList(items, title);
  const cast = movie.credits?.cast?.slice(0, 6) ?? [];
  const director = movie.credits?.crew?.find((person) => person.job === 'Director');
  const poster = posterUrl(movie.poster_path, 'w500');

  const addToList = () => {
    if (!onList) setItems([makeItem(title, { tmdbId: movie.id }), ...items]);
  };

  return (
    <section className="page">
      {backLink}

      <article className="details">
        <div className="details-poster">
          {poster ? (
            <img src={poster} alt={`${movie.title} poster`} />
          ) : (
            <span className="poster-missing">
              <Icon name="image_not_supported" />
            </span>
          )}
        </div>

        <div className="details-body">
          <h1 className="page-title">{movie.title}</h1>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}

          <ul className="facts">
            {movie.release_date && (
              <li>
                <Icon name="calendar_month" /> {new Date(movie.release_date + 'T00:00').toLocaleDateString()}
              </li>
            )}
            {movie.runtime > 0 && (
              <li>
                <Icon name="schedule" /> {formatRuntime(movie.runtime)}
              </li>
            )}
            {movie.vote_average > 0 && (
              <li>
                <Icon name="star" className="star-icon" /> {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count.toLocaleString()} votes)
              </li>
            )}
          </ul>

          {movie.genres?.length > 0 && (
            <ul className="genres">
              {movie.genres.map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
          )}

          <h2 className="section-title">Overview</h2>
          <p className="overview">{movie.overview || 'No overview is available for this movie yet.'}</p>

          {director && (
            <p className="item-meta director">
              Directed by <strong>{director.name}</strong>
            </p>
          )}

          {cast.length > 0 && (
            <>
              <h2 className="section-title">Top cast</h2>
              <ul className="cast">
                {cast.map((person) => (
                  <li key={person.credit_id}>
                    <strong>{person.name}</strong>
                    <span className="item-meta">{person.character}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <button type="button" className="btn-primary inline" onClick={addToList} disabled={onList}>
            <Icon name={onList ? 'check' : 'playlist_add'} />
            {onList ? 'On your StreamList' : 'Add to StreamList'}
          </button>
        </div>
      </article>
    </section>
  );
}

export default MovieDetails;
