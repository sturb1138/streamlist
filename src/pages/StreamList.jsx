import { useState } from 'react';
import Icon from '../components/Icon.jsx';

function StreamList() {
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // stop the page from reloading
    const title = input.trim();
    if (!title) return;

    console.log('StreamList input:', title);
    setInput(''); // clear the field for the next entry
  };

  return (
    <section className="page">
      <div className="hero">
        <h1 className="page-title">
          <Icon name="playlist_add" className="title-icon" />
          My StreamList
        </h1>
        <p className="page-subtitle">
          Add the movies and shows you want to watch next.
        </p>

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
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a movie or program title..."
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn-primary">
            <Icon name="add" />
            Add
          </button>
        </form>
        <p className="hint">
          <Icon name="terminal" /> Submitted titles are logged to the browser console
          (press F12 &rarr; Console).
        </p>
      </div>
    </section>
  );
}

export default StreamList;
