// Shared helpers so the StreamList page and the Movies pages add titles the same way.

export function isOnList(items, title) {
  return items.some((item) => item.title.toLowerCase() === title.trim().toLowerCase());
}

export function makeItem(title, extra = {}) {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    updatedAt: Date.now(),
    ...extra, // e.g. tmdbId when the title came from the Movies page
  };
}

// Turn a TMDB movie into a StreamList title, like "Inception (2010)".
export function movieTitle(movie) {
  const year = movie.year || (movie.release_date ? movie.release_date.slice(0, 4) : '');
  return year ? `${movie.title} (${year})` : movie.title;
}
