import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import 'material-symbols/rounded.css';
import '@fontsource-variable/inter';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter enables client-side navigation between pages */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
