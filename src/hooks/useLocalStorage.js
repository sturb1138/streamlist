import { useState, useEffect } from 'react';

function readValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function useLocalStorage(key, initialValue) {
  // Keep the first initialValue and reuse it. Callers usually pass [], and every []
  // is a brand-new array, so using initialValue directly in the effect below would
  // make it run again after every render. "fallback" never changes, so it won't.
  const [fallback] = useState(initialValue);
  const [value, setValue] = useState(() => readValue(key, fallback));

  // Save the value whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be full or blocked (for example in private browsing).
      // The app still works; it just won't remember this value.
    }
  }, [key, value]);

  // If the user has StreamList open in two tabs, keep them in sync.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === key) setValue(readValue(key, fallback));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, fallback]);

  return [value, setValue];
}

export default useLocalStorage;
