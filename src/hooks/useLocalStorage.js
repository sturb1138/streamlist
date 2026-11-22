import { useState, useEffect } from 'react';

function readValue(key, initialValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initialValue;
  } catch {
    return initialValue;
  }
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  // Save the value whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }, [key, value]);

  // If the user has StreamList open in two tabs, keep them in sync.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === key) setValue(readValue(key, initialValue));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
    // initialValue is only a fallback, so it is left out of the list on purpose.
  }, [key]);

  return [value, setValue];
}

export default useLocalStorage;
