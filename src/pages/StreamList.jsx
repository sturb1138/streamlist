import { useState, useEffect } from 'react';
import Icon from '../components/Icon.jsx';
import StreamItem from '../components/StreamItem.jsx';

const FILTERS = [
  { key: 'all', label: 'All', icon: 'list' },
  { key: 'active', label: 'To Watch', icon: 'schedule' },
  { key: 'completed', label: 'Watched', icon: 'task_alt' },
];

// items and setItems come from App, so the list is shared with the Navbar badge.
function StreamList({ items, setItems }) {
  const [input, setInput] = useState(''); // what is typed in the add box
  const [filter, setFilter] = useState('all'); // which tab is selected
  const [message, setMessage] = useState(''); // short warning, e.g. duplicate title
  const [lastDeleted, setLastDeleted] = useState(null); // for the Undo button

  // Hide the Undo bar automatically after 5 seconds.
  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => setLastDeleted(null), 5000);
    return () => clearTimeout(timer);
  }, [lastDeleted]);

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the page from reloading
    const title = input.trim();
    if (!title) return;

    const isDuplicate = items.some((item) => item.title.toLowerCase() === title.toLowerCase());
    if (isDuplicate) {
      setMessage(`You must really want to watch this, "${title}" is already on your list!`);
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      updatedAt: Date.now(),
    };
    setItems([newItem, ...items]); // newest title goes on top
    setInput(''); // clear the field for the next entry
    setMessage('');
  };

  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed, updatedAt: Date.now() } : item
      )
    );
  };

  const saveItem = (id, title) => {
    setItems(items.map((item) => (item.id === id ? { ...item, title } : item)));
  };

  const deleteItem = (id) => {
    const index = items.findIndex((item) => item.id === id);
    setLastDeleted({ item: items[index], index });
    setItems(items.filter((item) => item.id !== id));
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    const restored = [...items];
    restored.splice(lastDeleted.index, 0, lastDeleted.item); // put it back in its old spot
    setItems(restored);
    setLastDeleted(null);
  };

  const clearWatched = () => {
    setItems(items.filter((item) => !item.completed));
  };

  const visibleItems = items.filter((item) => {
    if (filter === 'active') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  const watchedCount = items.filter((item) => item.completed).length;
  const toWatchCount = items.length - watchedCount;

  return (
    <section className="page">
      <div className="hero">
        <h1 className="page-title">
          <Icon name="playlist_add" className="title-icon" />
          My StreamList
        </h1>
        <p className="page-subtitle">Add the movies and shows you want to watch next.</p>

        <form className="stream-form" onSubmit={handleSubmit}>
          <label htmlFor="stream-input" className="visually-hidden">
            Movie or program title
          </label>
          <div className="input-wrap">
            <Icon name="search" className="input-icon" />
            <input
              id="stream-input"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setMessage('');
              }}
              placeholder="Enter a Movie or TV show title..."
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={!input.trim()}>
            <Icon name="add" />
            Add
          </button>
        </form>

        {message && (
          <p className="form-message" role="alert">
            <Icon name="warning" /> {message}
          </p>
        )}

        {items.length > 0 && (
          <div className="list-toolbar">
            <div className="filter-tabs" role="group" aria-label="Filter titles">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={filter === f.key ? 'filter-tab active' : 'filter-tab'}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                >
                  <Icon name={f.icon} />
                  {f.label}
                </button>
              ))}
            </div>
            <span className="list-count">
              {toWatchCount} to watch &middot; {watchedCount} watched
            </span>
          </div>
        )}

        {visibleItems.length > 0 ? (
          <ul className="stream-list">
            {visibleItems.map((item) => (
              <StreamItem
                key={item.id}
                item={item}
                onToggle={toggleItem}
                onSave={saveItem}
                onDelete={deleteItem}
              />
            ))}
          </ul>
        ) : (
          <div className="list-empty">
            <Icon name={items.length === 0 ? 'movie_filter' : 'filter_list_off'} />
            <p>
              {items.length === 0
                ? 'Your list is empty, lets get to watching! Add a title above to get started.'
                : 'No titles match this filter.'}
            </p>
          </div>
        )}

        {watchedCount > 0 && (
          <button type="button" className="btn-text" onClick={clearWatched}>
            <Icon name="delete_sweep" /> Clear watched ({watchedCount})
          </button>
        )}

        <p className="hint">
          <Icon name="lightbulb" /> Tip: double-click a title to edit it. Press Esc to cancel.
        </p>
      </div>

      {lastDeleted && (
        <div className="toast" role="status">
          <span>Removed &ldquo;{lastDeleted.item.title}&rdquo;</span>
          <button type="button" className="toast-btn" onClick={undoDelete}>
            <Icon name="undo" /> Undo
          </button>
        </div>
      )}
    </section>
  );
}

export default StreamList;
