import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import MovieCard from '../components/MovieCard.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { searchMovies, hasApiKey, posterUrl } from '../api/tmdb.js';
import { isOnList, makeItem, movieTitle } from '../utils/watchList.js';

// Movies page: search TMDB and add results to the StreamList.
function Movies({ items, setItems }) {
  const [query, setQuery] = useLocalStorage('streamlist-movie-query', '');
  const [results, setResults] = useLocalStorage('streamlist-movie-results', []);
  const [searchedFor, setSearchedFor] = useLocalStorage('streamlist-movie-searched', '');
  const [recent] = useLocalStorage('streamlist-recently-viewed', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;

    setLoading(true);
    setError('');
    try {
      const movies = await searchMovies(text);
      setResults(movies);
      setSearchedFor(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearchedFor('');
    setError('');
  };

  const addMovie = (movie) => {
    const title = movieTitle(movie);
    if (isOnList(items, title)) return;
    setItems([makeItem(title, { tmdbId: movie.id }), ...items]);
  };

  return (
    <section className="page">
      <h1 className="page-title">
        <Icon name="movie" className="title-icon" />
        Movies
      </h1>
      <p className="page-subtitle">Search The Movie Database (TMDB) and add movies to your StreamList.</p>

      {!hasApiKey && (
        <p className="form-message" role="alert">
          <Icon name="key" /> No TMDB key found. Copy .env.example to .env, paste in your key, and restart
          npm run dev.
        </p>
      )}

      <form className="stream-form search-form" onSubmit={handleSearch} role="search">
        <label htmlFor="movie-search" className="visually-hidden">
          Search for a movie
        </label>
        <div className="input-wrap">
          <Icon name="search" className="input-icon" />
          <input
            id="movie-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie, like Jurassic Park..."
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={!query.trim() || loading}>
          <Icon name={loading ? 'hourglass_top' : 'travel_explore'} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <p className="form-message" role="alert">
          <Icon name="error" /> {error}
        </p>
      )}

      {searchedFor && (
        <div className="list-toolbar">
          <span className="list-count">
            {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{searchedFor}&rdquo;
          </span>
          <button type="button" className="btn-text no-margin" onClick={clearSearch}>
            <Icon name="close" /> Clear search
          </button>
        </div>
      )}

      {results.length > 0 && (
        <ul className="movie-grid">
          {results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onList={isOnList(items, movieTitle(movie))}
              onAdd={addMovie}
            />
          ))}
        </ul>
      )}

      {searchedFor && results.length === 0 && !loading && (
        <div className="list-empty">
          <Icon name="search_off" />
          <p>No movies matched that search. Check your spelling or try a different title.</p>
        </div>
      )}

      {!searchedFor && recent.length > 0 && (
        <div className="recent">
          <h2 className="section-title">
            <Icon name="history" /> Recently viewed
          </h2>
          <ul className="recent-list">
            {recent.map((movie) => (
              <li key={movie.id}>
                <Link to={`/movies/${movie.id}`} className="recent-item">
                  {movie.posterPath ? (
                    <img src={posterUrl(movie.posterPath, 'w92')} alt="" />
                  ) : (
                    <Icon name="movie" />
                  )}
                  <span>{movieTitle(movie)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!searchedFor && recent.length === 0 && (
        <div className="list-empty">
          <Icon name="movie_filter" />
          <p>Search for a title above to see posters, ratings, and details.</p>
        </div>
      )}
    </section>
  );
}

export default Movies;
