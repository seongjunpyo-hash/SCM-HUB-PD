import '@musinsa/layer-tokens/desktop-fonts.css';
import '@musinsa/layer-tokens/desktop-stylesheet.css';
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
