// Small helper for talking to The Movie Database (TMDB) API.
// Docs: https://developer.themoviedb.org/docs

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';

// The key is read from the .env file
const READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const hasApiKey = Boolean(READ_TOKEN || API_KEY);

async function tmdbFetch(path, params = {}) {
  if (!hasApiKey) {
    throw new Error('No TMDB key found. Add one to your .env file and restart the dev server.');
  }

  const url = new URL(BASE_URL + path);
  Object.entries({ language: 'en-US', ...params }).forEach(([name, value]) =>
    url.searchParams.set(name, value)
  );

  const headers = { accept: 'application/json' };
  if (READ_TOKEN) {
    headers.Authorization = `Bearer ${READ_TOKEN}`;
  } else {
    url.searchParams.set('api_key', API_KEY);
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    if (response.status === 401) throw new Error('TMDB rejected the API key. Double-check your .env file.');
    if (response.status === 404) throw new Error('That movie could not be found on TMDB.');
    throw new Error(`TMDB request failed (status ${response.status}). Please try again.`);
  }
  return response.json();
}

// Search for movies by title. Returns a short, simplified list.
export async function searchMovies(query) {
  const data = await tmdbFetch('/search/movie', { query, include_adult: 'false', page: 1 });
  return data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : '',
    rating: movie.vote_average,
    overview: movie.overview,
    posterPath: movie.poster_path,
  }));
}

// Get full details for one movie, including its cast.
export function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: 'credits' });
}

// Build a full image address from the poster path TMDB gives us.
export function posterUrl(path, size = 'w342') {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}
