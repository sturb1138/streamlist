import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

function StreamItem({ item, onToggle, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.title);

  const startEdit = () => {
    setEditText(item.title);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditText(item.title);
    setIsEditing(false);
  };

  const saveEdit = (event) => {
    event.preventDefault();
    const title = editText.trim();
    if (!title) return; // do not allow an empty title
    onSave(item.id, title);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="stream-item editing">
        <form className="edit-form" onSubmit={saveEdit}>
          <label htmlFor={`edit-${item.id}`} className="visually-hidden">
            Edit title
          </label>
          <input
            id={`edit-${item.id}`}
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && cancelEdit()}
            autoFocus
          />
          <button type="submit" className="icon-btn save" aria-label="Save" title="Save">
            <Icon name="check" />
          </button>
          <button type="button" className="icon-btn" onClick={cancelEdit} aria-label="Cancel" title="Cancel">
            <Icon name="close" />
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className={item.completed ? 'stream-item completed' : 'stream-item'}>
      <button
        type="button"
        className="check-btn"
        onClick={() => onToggle(item.id)}
        aria-label={item.completed ? 'Mark as not watched' : 'Mark as watched'}
        title={item.completed ? 'Mark as not watched' : 'Mark as watched'}
      >
        <Icon name={item.completed ? 'check_circle' : 'radio_button_unchecked'} />
      </button>

      <div className="item-text" onDoubleClick={startEdit}>
        <span className="item-title">{item.title}</span>
        <span className="item-meta">
          {item.completed ? 'Watched' : 'Added'} {new Date(item.updatedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="item-actions">
        {item.tmdbId && (
          <Link to={`/movies/${item.tmdbId}`} className="icon-btn" aria-label="Movie details" title="Movie details">
            <Icon name="info" />
          </Link>
        )}
        <button type="button" className="icon-btn" onClick={startEdit} aria-label="Edit" title="Edit">
          <Icon name="edit" />
        </button>
        <button type="button" className="icon-btn danger" onClick={() => onDelete(item.id)} aria-label="Delete" title="Delete">
          <Icon name="delete" />
        </button>
      </div>
    </li>
  );
}

export default StreamItem;
